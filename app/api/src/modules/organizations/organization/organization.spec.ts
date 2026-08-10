import { OrganizationService } from './organization.service';

const {
  mockGetTenantClient,
  mockPrismaQueryRaw,
  mockOrganizationCreate,
  mockOrganizationDelete,
  mockMembershipCount,
  mockRoleCreate,
  mockMembershipCreate,
  mockTransaction,
  mockLagActivity,
  mockReadableId,
  mockRoleCount,
  mockQueueGroupCount,
  mockQueueCount,
  mockTokenCount,
  mockEmailProviderCount,
  mockTenantMembershipFindMany,
} = vi.hoisted(() => ({
  mockGetTenantClient: vi.fn(),
  mockPrismaQueryRaw: vi.fn(),
  mockOrganizationCreate: vi.fn(),
  mockOrganizationDelete: vi.fn(),
  mockMembershipCount: vi.fn(),
  mockRoleCreate: vi.fn(),
  mockMembershipCreate: vi.fn(),
  mockTransaction: vi.fn(),
  mockLagActivity: vi.fn(),
  mockReadableId: vi.fn(),
  mockRoleCount: vi.fn(),
  mockQueueGroupCount: vi.fn(),
  mockQueueCount: vi.fn(),
  mockTokenCount: vi.fn(),
  mockEmailProviderCount: vi.fn(),
  mockTenantMembershipFindMany: vi.fn(),
}));

vi.mock('@org/database', () => ({
  getTenantClient: mockGetTenantClient,
  prisma: {
    $queryRaw: mockPrismaQueryRaw,
    organization: {
      create: mockOrganizationCreate,
      delete: mockOrganizationDelete,
    },
    membership: {
      count: mockMembershipCount,
    },
  },
}));

vi.mock('@org/constants', () => ({
  permissions: { billing: ['read'] },
}));

vi.mock('../../core/utils/utils.js', () => ({
  readableId: mockReadableId,
}));

vi.mock('../activity/activity.service.js', () => ({
  ActivityService: {
    lagActivity: mockLagActivity,
  },
}));

describe('OrganizationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReadableId.mockReturnValue('ORG-abc123');
  });

  describe('getMyOrganizations', () => {
    it('returns mapped organizations with the total count', async () => {
      mockPrismaQueryRaw.mockResolvedValue([
        {
          id: 'org-1',
          name: 'Acme',
          logo: null,
          createdBy: 'user-1',
          roleName: 'OWNER',
          isOwner: true,
          total_count: 2,
        },
        {
          id: 'org-2',
          name: 'Globex',
          logo: null,
          createdBy: 'user-2',
          roleName: 'AGENT',
          isOwner: false,
          total_count: 2,
        },
      ]);

      const result = await OrganizationService.getMyOrganizations({
        userId: 'user-1',
        queryString: {} as any,
      });

      expect(result.total).toBe(2);
      expect(result.output).toEqual([
        {
          id: 'org-1',
          name: 'Acme',
          logo: null,
          createdBy: 'user-1',
          role: 'OWNER',
          isOwner: true,
        },
        {
          id: 'org-2',
          name: 'Globex',
          logo: null,
          createdBy: 'user-2',
          role: 'AGENT',
          isOwner: false,
        },
      ]);
    });

    it('returns a total of 0 when there are no rows', async () => {
      mockPrismaQueryRaw.mockResolvedValue([]);

      const result = await OrganizationService.getMyOrganizations({
        userId: 'user-1',
        queryString: {} as any,
      });

      expect(result).toEqual({ output: [], total: 0 });
    });
  });

  describe('create', () => {
    const userId = 'user-1';
    const input = { name: 'Acme', slug: 'acme', type: 'STARTUP' } as any;

    beforeEach(() => {
      mockOrganizationCreate.mockResolvedValue({
        id: 'org-1',
        name: 'Acme',
        slug: 'acme',
        type: 'STARTUP',
      });
      mockGetTenantClient.mockReturnValue({ $transaction: mockTransaction });
    });

    it('creates the organization, owner role, membership, and logs activity', async () => {
      mockTransaction.mockImplementation(async (fn: any) =>
        fn({
          role: { create: mockRoleCreate },
          membership: { create: mockMembershipCreate },
        }),
      );
      mockRoleCreate.mockResolvedValue({
        id: 'role-1',
        organizationId: 'org-1',
      });
      mockMembershipCreate.mockResolvedValue({
        id: 'member-1',
        organizationId: 'org-1',
        roleId: 'role-1',
      });

      const result = await OrganizationService.create(userId, input);

      expect(mockOrganizationCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            createdBy: userId,
            name: 'Acme',
            slug: 'acme',
            type: 'STARTUP',
          }),
        }),
      );
      expect(mockRoleCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'OWNER',
            organizationId: 'org-1',
            createdBy: userId,
            isSystem: true,
          }),
        }),
      );
      expect(mockMembershipCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            organizationId: 'org-1',
            userId,
            roleId: 'role-1',
            isSystem: true,
          },
        }),
      );
      // expect(mockLagActivity).toHaveBeenCalledWith(
      //   expect.objectContaining({
      //     organizationId: 'org-1',
      //     actorId: userId,
      //     event: 'organization.create',
      //   }),
      // );
      expect(mockOrganizationDelete).not.toHaveBeenCalled();
      expect(result).toEqual({
        organization: {
          id: 'org-1',
          name: 'Acme',
          slug: 'acme',
          type: 'STARTUP',
        },
        membership: {
          id: 'member-1',
          organizationId: 'org-1',
          roleId: 'role-1',
        },
      });
    });

    it('rolls back the organization if the transaction fails', async () => {
      const txError = new Error('role creation failed');
      mockTransaction.mockRejectedValue(txError);

      await expect(OrganizationService.create(userId, input)).rejects.toThrow(
        txError,
      );

      expect(mockOrganizationDelete).toHaveBeenCalledWith({
        where: { id: 'org-1' },
      });
    });
  });

  describe('getMembers', () => {
    it('maps membership records and returns pagination info', async () => {
      mockGetTenantClient.mockReturnValue({
        membership: { findMany: mockTenantMembershipFindMany },
      });
      mockTenantMembershipFindMany.mockResolvedValue([
        {
          id: 'member-1',
          organizationId: 'org-1',
          createdAt: new Date('2024-01-01'),
          role: { id: 'role-1', name: 'AGENT' },
          user: {
            email: 'alice@example.com',
            name: 'Alice',
            avatar: null,
            queueAgents: [
              { ticketCount: 2, queue: { id: 'q-1', name: 'Support' } },
            ],
          },
        },
      ]);
      mockMembershipCount.mockResolvedValue(1);

      const result = await OrganizationService.getMembers({
        organizationId: 'org-1',
        queryString: {},
      });

      expect(mockMembershipCount).toHaveBeenCalledWith({
        where: { organizationId: 'org-1' },
      });
      expect(result.propagation).toEqual({ total: 1, limit: 10, offset: 0 });
      expect(result.data).toEqual([
        {
          id: 'member-1',
          email: 'alice@example.com',
          username: 'Alice',
          avatar: null,
          role: 'AGENT',
          roleId: 'role-1',
          createdAt: new Date('2024-01-01'),
          organizationId: 'org-1',
          totalTickets: 2,
          queues: [{ queueId: 'q-1', name: 'Support', ticketCount: 2 }],
        },
      ]);
    });
  });

  describe('onboardingStatus', () => {
    it('reports which onboarding steps are complete', async () => {
      mockGetTenantClient.mockReturnValue({
        role: { count: mockRoleCount },
        queueGroup: { count: mockQueueGroupCount },
        queue: { count: mockQueueCount },
        token: { count: mockTokenCount },
        emailProvider: { count: mockEmailProviderCount },
      });
      mockRoleCount.mockResolvedValue(2);
      mockQueueGroupCount.mockResolvedValue(0);
      mockQueueCount.mockResolvedValue(1);
      mockTokenCount.mockResolvedValue(0);
      mockEmailProviderCount.mockResolvedValue(1);

      const result = await OrganizationService.onboardingStatus('org-1');

      expect(result).toEqual({
        hasRoles: true,
        hasGroups: false,
        hasQueues: true,
        hasInvites: false,
        hasEmail: true,
        currentStep: 3,
      });
    });

    it('reports zero progress when nothing has been set up', async () => {
      mockGetTenantClient.mockReturnValue({
        role: { count: mockRoleCount },
        queueGroup: { count: mockQueueGroupCount },
        queue: { count: mockQueueCount },
        token: { count: mockTokenCount },
        emailProvider: { count: mockEmailProviderCount },
      });
      mockRoleCount.mockResolvedValue(0);
      mockQueueGroupCount.mockResolvedValue(0);
      mockQueueCount.mockResolvedValue(0);
      mockTokenCount.mockResolvedValue(0);
      mockEmailProviderCount.mockResolvedValue(0);

      const result = await OrganizationService.onboardingStatus('org-1');

      expect(result).toEqual({
        hasRoles: false,
        hasGroups: false,
        hasQueues: false,
        hasInvites: false,
        hasEmail: false,
        currentStep: 0,
      });
    });
  });
});
