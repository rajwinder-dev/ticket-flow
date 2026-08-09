import { describe, it, expect, vi, afterEach } from 'vitest';
import AuthService from './auth.service';
import { getTenantClient } from '@org/database';
const { mockGetTenantClient, mockFindUnique, mockAuth } = vi.hoisted(() => ({
  mockGetTenantClient: vi.fn(),
  mockFindUnique: vi.fn(),
  mockAuth: vi.fn().mockReturnValue(undefined),
}));

vi.mock('@org/database', () => ({
  getTenantClient: mockGetTenantClient.mockReturnValue({
    membership: {
      findUnique: mockFindUnique,
    },
  }),
}));
vi.mock('@org/auth', () => ({
  auth: mockAuth,
}));
describe('AuthService', () => {
  const userId = 'user-1';
  const organizationId = 'org-1';
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe('getPermissions', () => {
    it('returns permissions when membership exists', async () => {
      const role = { permissions: ['read', 'write'] };
      mockFindUnique.mockResolvedValue({ role });
      const result = await AuthService.getPermissions(userId, organizationId);
      expect(getTenantClient).toHaveBeenCalledWith(organizationId);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: {
          organizationId_userId: { organizationId, userId },
        },
        include: { role: true },
      });
      expect(result).toEqual({ permissions: role.permissions });
    });
  });
  describe('CheakUserORganization', () => {
    it('returns the membership record when found', async () => {
      const membership = { userId, organizationId, roleId: 'role-1' };
      mockFindUnique.mockResolvedValue(membership);

      const result = await AuthService.CheakUserORganization({
        userId,
        organizationId,
      });

      expect(getTenantClient).toHaveBeenCalledWith(organizationId);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: {
          organizationId_userId: { organizationId, userId },
        },
      });
      expect(result).toEqual(membership);
    });
  });
});
