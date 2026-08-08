import { TokenService } from './token.service';

const {
  mockGetTenantClient,
  mockRoleFindUnique,
  mockTokenUpdateMany,
  mockTokenCreate,
  mockTokenFindFirst,
  mockTokenUpdate,
  mockTransaction,
  mockCreateTokenHash,
} = vi.hoisted(() => ({
  mockGetTenantClient: vi.fn(),
  mockRoleFindUnique: vi.fn(),
  mockTokenUpdateMany: vi.fn(),
  mockTokenCreate: vi.fn(),
  mockTokenFindFirst: vi.fn(),
  mockTokenUpdate: vi.fn(),
  mockTransaction: vi.fn(),
  mockCreateTokenHash: vi.fn(),
}));

vi.mock('@org/database', () => ({
  getTenantClient: mockGetTenantClient,
  prisma: {
    token: {
      updateMany: mockTokenUpdateMany,
      create: mockTokenCreate,
      findFirst: mockTokenFindFirst,
      update: mockTokenUpdate,
    },
    $transaction: mockTransaction,
  },
}));

vi.mock('@org/utils', () => ({
  createTokenHash: mockCreateTokenHash,
}));

describe('TokenService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenantClient.mockReturnValue({
      role: { findUnique: mockRoleFindUnique },
    });
    mockTransaction.mockImplementation(async (queries: Promise<unknown>[]) =>
      Promise.all(queries),
    );
  });

  describe('verifyToken', () => {
    it('returns the most recent pending, non-expired token', async () => {
      mockTokenFindFirst.mockResolvedValue({
        id: 'token-1',
        token: 'tok-123',
        status: 'PENDING',
      });

      const result = await TokenService.verifyToken('tok-123');

      expect(mockTokenFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            token: 'tok-123',
            status: 'PENDING',
            expiresAt: { gt: expect.any(Date) },
          }),
          orderBy: { createdAt: 'desc' },
        }),
      );
      expect(result).toEqual({
        id: 'token-1',
        token: 'tok-123',
        status: 'PENDING',
      });
    });

    it('returns null when no matching token is found', async () => {
      mockTokenFindFirst.mockResolvedValue(null);

      const result = await TokenService.verifyToken('bad-token');

      expect(result).toBeNull();
    });
  });

  describe('getTokenDetails', () => {
    it('throws when the token is expired or invalid', async () => {
      mockTokenFindFirst.mockResolvedValue(null);

      await expect(
        TokenService.getTokenDetails('bad-token'),
      ).rejects.toMatchObject({
        message: 'Link expired or invalid',
        statusCode: 404,
        code: 'EXPIRED_TOKEN',
      });
    });

    it('attaches the role name when organizationId and roleId are present', async () => {
      mockTokenFindFirst.mockResolvedValue({
        organizationId: 'org-1',
        roleId: 'role-1',
        email: 'a@example.com',
      });
      mockRoleFindUnique.mockResolvedValue({ id: 'role-1', name: 'AGENT' });

      const result = await TokenService.getTokenDetails('tok-123');

      expect(mockGetTenantClient).toHaveBeenCalledWith('org-1');
      expect(mockRoleFindUnique).toHaveBeenCalledWith({
        where: { id: 'role-1' },
      });
      expect(result).toEqual({
        organizationId: 'org-1',
        roleId: 'role-1',
        email: 'a@example.com',
        role: 'AGENT',
      });
    });

    it('leaves role undefined when organizationId or roleId is missing', async () => {
      mockTokenFindFirst.mockResolvedValue({
        organizationId: null,
        roleId: null,
        email: 'a@example.com',
      });

      const result = await TokenService.getTokenDetails('tok-123');

      expect(mockGetTenantClient).not.toHaveBeenCalled();
      expect(result).toEqual({
        organizationId: null,
        roleId: null,
        email: 'a@example.com',
        role: undefined,
      });
    });
  });

  describe('createToken', () => {
    it('revokes any pending tokens for the same email/type, then creates a new one — atomically', async () => {
      mockCreateTokenHash.mockReturnValue('new-token-hash');
      mockTokenUpdateMany.mockResolvedValue({ count: 1 });
      mockTokenCreate.mockResolvedValue({
        id: 'token-1',
        token: 'new-token-hash',
      });
      const expiresAt = new Date('2024-02-01');

      const result = await TokenService.createToken({
        input: {
          email: 'a@example.com',
          type: 'INVITE_USER',
          organizationId: 'org-1',
          roleId: 'role-1',
          createdBy: 'user-1',
        } as any,
        expiresAt,
      });

      // Both operations must be run inside the same transaction call.
      expect(mockTransaction).toHaveBeenCalledTimes(1);
      expect(mockTokenUpdateMany).toHaveBeenCalledWith({
        where: {
          type: 'INVITE_USER',
          status: 'PENDING',
          email: 'a@example.com',
        },
        data: { status: 'REVOKED' },
      });
      expect(mockTokenCreate).toHaveBeenCalledWith({
        data: {
          email: 'a@example.com',
          type: 'INVITE_USER',
          organizationId: 'org-1',
          roleId: 'role-1',
          createdBy: 'user-1',
          token: 'new-token-hash',
          expiresAt,
        },
      });
      expect(result).toEqual({ id: 'token-1', token: 'new-token-hash' });
    });

    it('does not leave old tokens revoked if the transaction fails', async () => {
      mockCreateTokenHash.mockReturnValue('new-token-hash');
      const txError = new Error('unique constraint violation');
      mockTransaction.mockRejectedValue(txError);

      await expect(
        TokenService.createToken({
          input: {
            email: 'a@example.com',
            type: 'INVITE_USER',
            organizationId: 'org-1',
            roleId: 'role-1',
            createdBy: 'user-1',
          } as any,
          expiresAt: new Date('2024-02-01'),
        }),
      ).rejects.toThrow(txError);
      expect(mockTransaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateTokenStatus', () => {
    it('updates the token status', async () => {
      mockTokenUpdate.mockResolvedValue({ token: 'tok-123', status: 'USED' });

      const result = await TokenService.updateTokenStatus('tok-123', 'USED');

      expect(mockTokenUpdate).toHaveBeenCalledWith({
        where: { token: 'tok-123' },
        data: { status: 'USED' },
      });
      expect(result).toEqual({ token: 'tok-123', status: 'USED' });
    });
  });
});
