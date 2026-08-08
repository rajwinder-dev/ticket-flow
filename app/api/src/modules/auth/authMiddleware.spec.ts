import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authMiddleware } from './auth.middleware';

// ---- Hoisted mocks (must be created before vi.mock factories run) ----
const {
  mockGetSession,
  mockFromNodeHeaders,
  mockGetTenantClient,
  mockFindUnique,
  mockFindFirst,
} = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockFromNodeHeaders: vi.fn(),
  mockGetTenantClient: vi.fn(),
  mockFindUnique: vi.fn(),
  mockFindFirst: vi.fn(),
}));

vi.mock('@org/auth', () => ({
  auth: {
    api: {
      getSession: mockGetSession,
    },
  },
}));

vi.mock('better-auth/node', () => ({
  fromNodeHeaders: mockFromNodeHeaders,
}));

vi.mock('@org/database', () => ({
  getTenantClient: mockGetTenantClient,
}));

vi.mock('../../core/utils/catchAsync.js', () => ({
  catchAsync: (fn: (...args: any[]) => any) => fn,
}));

vi.mock('../../core/utils/appError.js', () => ({
  appError: class AppError extends Error {
    statusCode: number;
    code: string;
    details?: unknown;
    constructor(
      message: string,
      statusCode: number,
      code: string,
      details?: unknown,
    ) {
      super(message);
      this.statusCode = statusCode;
      this.code = code;
      this.details = details;
    }
  },
}));

describe('authMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenantClient.mockReturnValue({
      membership: {
        findUnique: mockFindUnique,
        findFirst: mockFindFirst,
      },
    });
    mockFromNodeHeaders.mockReturnValue({ mocked: 'headers' });
  });

  // ---------------------------------------------------------------------
  describe('protectedRoute', () => {
    it('allow user when a session exists', async () => {
      const session = {
        user: { id: 'user-1', name: 'Alice', email: 'alice@example.com' },
      };
      mockGetSession.mockResolvedValue(session);

      const req: any = { headers: { cookie: 'a=b' } };
      const res: any = {};
      const next = vi.fn();

      await authMiddleware.protectedRoute(req, res, next);

      expect(mockFromNodeHeaders).toHaveBeenCalledWith(req.headers);
      expect(mockGetSession).toHaveBeenCalledWith({
        headers: { mocked: 'headers' },
      });
      expect(req.user).toEqual({
        id: 'user-1',
        username: 'Alice',
        email: 'alice@example.com',
      });
      expect(next).toHaveBeenCalledWith();
    });

    it('calls next() with a 401 appError when there is no session', async () => {
      mockGetSession.mockResolvedValue(null);

      const req: any = { headers: {} };
      const res: any = {};
      const next = vi.fn();

      await authMiddleware.protectedRoute(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const err = next.mock.calls[0][0];
      expect(err.message).toBe('Unauthorized');
      expect(err.statusCode).toBe(401);
      expect(err.code).toBe('INVALID_SESSION');
      expect(req.user).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------
  describe('tenant', () => {
    const validOrgId = '550e8400-e29b-41d4-a716-446655440000';

    it('throw error when req.user is missing', async () => {
      const req: any = { user: {}, header: vi.fn() };
      const next = vi.fn();

      await authMiddleware.tenant(req, {} as any, next);

      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('VALIDATION_ERROR');
      expect(mockGetTenantClient).not.toHaveBeenCalled();
    });

    it('throw error when x-organization-id header is missing', async () => {
      const req: any = {
        user: { id: 'user-1' },
        header: vi.fn().mockReturnValue(undefined),
      };
      const next = vi.fn();

      await authMiddleware.tenant(req, {} as any, next);

      const err = next.mock.calls[0][0];
      expect(err.message).toBe('x-organization-id required');
      expect(err.statusCode).toBe(400);
    });

    it('throw error when x-organization-id is not a valid UUID', async () => {
      const req: any = {
        user: { id: 'user-1' },
        header: vi.fn().mockReturnValue('not-a-uuid'),
      };
      const next = vi.fn();

      await authMiddleware.tenant(req, {} as any, next);

      const err = next.mock.calls[0][0];
      expect(err.message).toBe('x-organization-id must be a valid UUID');
      expect(err.statusCode).toBe(400);
      // getTenantClient is still called before the UUID check in the source,
      // so we only assert the validation error surfaced, not call counts.
    });

    it('throw error when the user has no membership/role', async () => {
      const req: any = {
        user: { id: 'user-1' },
        header: vi.fn().mockReturnValue(validOrgId),
      };
      const next = vi.fn();

      mockFindUnique.mockResolvedValue(null);
      mockFindFirst.mockResolvedValue(null);

      await authMiddleware.tenant(req, {} as any, next);
      expect(req.header).toHaveBeenCalledWith('x-organization-id');
      const err = next.mock.calls[0][0];
      expect(err.message).toBe('user not member of any organization');
      expect(err.statusCode).toBe(403);
      expect(err.code).toBe('FORBIDDEN');
    });

    it('attaches tenant context and succes', async () => {
      const req: any = {
        user: { id: 'user-1' },
        header: vi.fn().mockReturnValue(validOrgId),
        organization: {},
      };
      const next = vi.fn();

      mockFindUnique.mockResolvedValue({
        organization: { createdBy: 'user-0', name: 'Acme' },
        user: { name: 'Alice' },
        role: { name: 'OWNER', permissions: { billing: ['read'] } },
      });
      mockFindFirst.mockResolvedValue({ userId: 'user-0' });

      await authMiddleware.tenant(req, {} as any, next);

      expect(mockGetTenantClient).toHaveBeenCalledWith(validOrgId);
      expect(mockFindUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            organizationId_userId: {
              userId: 'user-1',
              organizationId: validOrgId,
            },
          },
        }),
      );
      expect(req.organization).toEqual({
        isOwner: true,
        ownerId: 'user-0',
        id: validOrgId,
        name: 'Acme',
      });
      expect(req.user).toEqual({
        id: 'user-1',
        role: 'OWNER',
        username: 'Alice',
        permissions: { billing: ['read'] },
      });
      expect(next).toHaveBeenCalledWith();
    });
  });

  // ---------------------------------------------------------------------
  describe('verifyPermission', () => {
    it('Allows immediately when the user is the owner', async () => {
      const req: any = {
        organization: { isOwner: true },
        user: { permissions: {} },
      };
      const next = vi.fn();

      await authMiddleware.verifyPermission('billing' as any, 'read' as any)(
        req,
        {} as any,
        next,
      );

      expect(next).toHaveBeenCalledWith();
    });

    it('throw error  500 when req.user.permissions is missing', async () => {
      const req: any = { organization: { isOwner: false }, user: {} };
      const next = vi.fn();

      await authMiddleware.verifyPermission('billing' as any, 'read' as any)(
        req,
        {} as any,
        next,
      );

      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(500);
      expect(err.code).toBe('INTERNAL_ERROR');
    });

    it('throw error when the module/action is not permitted', async () => {
      const req: any = {
        organization: { isOwner: false },
        user: { permissions: { billing: ['read'] } },
      };
      const next = vi.fn();

      await authMiddleware.verifyPermission('billing' as any, 'write' as any)(
        req,
        {} as any,
        next,
      );

      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(403);
      expect(err.code).toBe('FORBIDDEN');
    });

    it('Allows when the action is permitted', async () => {
      const req: any = {
        organization: { isOwner: false },
        user: { permissions: { billing: ['read', 'write'] } },
      };
      const next = vi.fn();

      await authMiddleware.verifyPermission('billing' as any, 'write' as any)(
        req,
        {} as any,
        next,
      );

      expect(next).toHaveBeenCalledWith();
    });
  });

  // ---------------------------------------------------------------------
  describe('restrictToOwner', () => {
    it('throw Error when the user is not the owner', async () => {
      const req: any = { organization: { isOwner: false } };
      const next = vi.fn();

      await authMiddleware.restrictToOwner(req, {} as any, next);

      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(403);
      expect(err.code).toBe('FORBIDDEN');
      expect(err.details).toEqual({ isOwner: false });
    });

    it('Allows when the user is the owner', async () => {
      const req: any = { organization: { isOwner: true } };
      const next = vi.fn();

      await authMiddleware.restrictToOwner(req, {} as any, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  // ---------------------------------------------------------------------
  describe('SocketAuth', () => {
    it('throw error when the cookie header is missing', async () => {
      const socket: any = { request: { headers: {} } };
      const next = vi.fn();

      await authMiddleware.SocketAuth(socket, next);

      const err = next.mock.calls[0][0];
      expect(err.message).toBe('Cookie header not found');
      expect(err.statusCode).toBe(401);
      expect(err.code).toBe('NOT_FOUND');
    });

    it('throw error when getSession returns no session', async () => {
      const socket: any = { request: { headers: { cookie: 'a=b' } } };
      const next = vi.fn();
      mockGetSession.mockResolvedValue(null);

      await authMiddleware.SocketAuth(socket, next);

      expect(mockGetSession).toHaveBeenCalledWith({
        headers: { cookie: 'a=b' },
      });
      const err = next.mock.calls[0][0];
      expect(err.message).toBe('Unauthorized');
      expect(err.statusCode).toBe(401);
      expect(err.code).toBe('INVALID_SESSION');
    });

    it('attaches socket.user and calls next() on success', async () => {
      const socket: any = { request: { headers: { cookie: 'a=b' } } };
      const next = vi.fn();
      mockGetSession.mockResolvedValue({
        user: { id: 'user-1', name: 'Alice', email: 'alice@example.com' },
      });

      await authMiddleware.SocketAuth(socket, next);

      expect(socket.user).toEqual({
        id: 'user-1',
        username: 'Alice',
        email: 'alice@example.com',
      });
      expect(next).toHaveBeenCalledWith();
    });
  });
});
