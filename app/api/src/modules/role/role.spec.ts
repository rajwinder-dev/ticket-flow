import { RoleService } from './role.service';

const {
  mockGetTenantClient,
  mockRoleFindMany,
  mockRoleCount,
  mockRoleCreate,
  mockRoleFindUnique,
  mockRoleUpdate,
  mockMemberShipCount,
  mockLagActivity,
  mockReadableId,
} = vi.hoisted(() => ({
  mockGetTenantClient: vi.fn(),
  mockRoleFindMany: vi.fn(),
  mockRoleCount: vi.fn(),
  mockRoleCreate: vi.fn(),
  mockRoleFindUnique: vi.fn(),
  mockRoleUpdate: vi.fn(),
  mockMemberShipCount: vi.fn(),
  mockLagActivity: vi.fn(),
  mockReadableId: vi.fn(),
}));

vi.mock('@org/database', () => ({
  getTenantClient: mockGetTenantClient,
}));

vi.mock('../activity/activity.service.js', () => ({
  ActivityService: {
    lagActivity: mockLagActivity,
  },
}));

vi.mock('../../core/utils/utils.js', () => ({
  readableId: mockReadableId,
}));

describe('RoleService', () => {
  const organizationId = 'org-1';
  const userId = 'user-1';

  beforeEach(() => {
    vi.clearAllMocks();
    mockReadableId.mockReturnValue('ROL-abc123');
    mockGetTenantClient.mockReturnValue({
      role: {
        findMany: mockRoleFindMany,
        count: mockRoleCount,
        create: mockRoleCreate,
        findUnique: mockRoleFindUnique,
        update: mockRoleUpdate,
      },
      membership: {
        count: mockMemberShipCount,
      },
    });
  });

  describe('getAllRoles', () => {
    it('returns non-system, active roles with pagination', async () => {
      mockRoleFindMany.mockResolvedValue([
        {
          id: 'role-1',
          code: 'ROL-1',
          name: 'Agent',
          description: '',
          permissions: {},
        },
      ]);
      mockRoleCount.mockResolvedValue(1);

      const result = await RoleService.getAllRoles({
        organizationId,
        queryString: {} as any,
      });

      expect(mockRoleFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { organizationId, active: true, isSystem: false },
          skip: 0,
          take: 10,
        }),
      );
      expect(result).toEqual({
        data: [
          {
            id: 'role-1',
            code: 'ROL-1',
            name: 'Agent',
            description: '',
            permissions: {},
          },
        ],
        pagination: { limit: 10, offset: 0, total: 1 },
      });
    });
  });

  describe('create', () => {
    it('creates a role with a generated code and logs activity', async () => {
      mockRoleCreate.mockResolvedValue({ id: 'role-1', name: 'Agent' });

      const result = await RoleService.create(userId, organizationId, {
        name: 'Agent',
        permissions: {},
      } as any);

      expect(mockRoleCreate).toHaveBeenCalledWith({
        data: {
          name: 'Agent',
          permissions: {},
          code: 'ROL-abc123',
          organizationId,
          createdBy: userId,
        },
      });
      expect(mockLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'role.create', entityId: 'role-1' }),
      );
      expect(result).toEqual({ id: 'role-1', name: 'Agent' });
    });
  });

  describe('update', () => {
    it('updates a non-system role and logs old/new data', async () => {
      mockRoleFindUnique.mockResolvedValue({ id: 'role-1', name: 'Agent' });
      mockRoleUpdate.mockResolvedValue({ id: 'role-1', name: 'Senior Agent' });

      const result = await RoleService.update({
        roleId: 'role-1',
        organizationId,
        userId,
        input: { name: 'Senior Agent' } as any,
      });

      expect(mockRoleUpdate).toHaveBeenCalledWith({
        data: { name: 'Senior Agent' },
        where: { id: 'role-1', organizationId, isSystem: false },
      });
      expect(mockLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'role.update',
          oldData: { id: 'role-1', name: 'Agent' },
          newData: { id: 'role-1', name: 'Senior Agent' },
        }),
      );
      expect(result).toEqual({ id: 'role-1', name: 'Senior Agent' });
    });
  });

  describe('delete', () => {
    it('throws 404 when the role does not exist', async () => {
      mockRoleFindUnique.mockResolvedValue(null);

      await expect(
        RoleService.delete({ roleId: 'role-1', organizationId, userId }),
      ).rejects.toMatchObject({ statusCode: 404, code: 'NOT_FOUND' });

      expect(mockRoleUpdate).not.toHaveBeenCalled();
    });

    it('throws a conflict when the role is already deleted', async () => {
      mockRoleFindUnique.mockResolvedValue({ active: false });

      await expect(
        RoleService.delete({ roleId: 'role-1', organizationId, userId }),
      ).rejects.toMatchObject({
        message: 'Role Already deleted',
        statusCode: 409,
        code: 'CONFLICT_ERROR',
      });
    });

    it('throws a conflict when users are still assigned to the role', async () => {
      mockRoleFindUnique.mockResolvedValue({ active: true });
      mockMemberShipCount.mockResolvedValue(3);

      await expect(
        RoleService.delete({ roleId: 'role-1', organizationId, userId }),
      ).rejects.toMatchObject({
        message: 'users are already assigned to this role',
        statusCode: 409,
        code: 'CONFLICT_ERROR',
      });

      expect(mockRoleUpdate).not.toHaveBeenCalled();
    });

    it('deactivates the role and logs activity when nothing blocks deletion', async () => {
      mockRoleFindUnique.mockResolvedValue({ active: true });
      mockMemberShipCount.mockResolvedValue(0);
      mockRoleUpdate.mockResolvedValue({ id: 'role-1', active: false });

      await RoleService.delete({ roleId: 'role-1', organizationId, userId });

      expect(mockRoleUpdate).toHaveBeenCalledWith({
        data: { active: false },
        where: { id: 'role-1', organizationId, isSystem: false },
      });
      expect(mockLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'role.update', entityId: 'role-1' }),
      );
    });
  });
});
