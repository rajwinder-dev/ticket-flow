import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MemberService } from './member.service';

const {
  mockGetTenantClient,
  mockFindMany,
  mockCount,
  mockMembershipUpdate,
  mockQueueAgentUpsert,
  mockQueueAgentDelete,
  mockSendNotification,
} = vi.hoisted(() => ({
  mockGetTenantClient: vi.fn(),
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
  mockMembershipUpdate: vi.fn(),
  mockQueueAgentUpsert: vi.fn(),
  mockQueueAgentDelete: vi.fn(),
  mockSendNotification: vi.fn(),
}));

vi.mock('@org/database', () => ({
  getTenantClient: mockGetTenantClient,
}));

vi.mock('../notification/notification.service', () => ({
  NotificationService: {
    sendNotification: mockSendNotification,
  },
}));

describe('MemberService', () => {
  const organizationId = 'org-1';

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenantClient.mockReturnValue({
      membership: {
        findMany: mockFindMany,
        count: mockCount,
        update: mockMembershipUpdate,
      },
      queueAgent: {
        upsert: mockQueueAgentUpsert,
        delete: mockQueueAgentDelete,
      },
    });
  });

  describe('getMembers', () => {
    it('maps membership records into the expected shape', async () => {
      mockFindMany.mockResolvedValue([
        {
          id: 'member-1',
          organizationId,
          createdAt: new Date('2024-01-01'),
          role: { id: 'role-1', name: 'AGENT' },
          user: {
            id: 'user-1',
            email: 'alice@example.com',
            name: 'Alice',
            avatar: null,
            queueAgents: [
              {
                ticketCount: 3,
                queueId: 'q-1',
                queue: { id: 'q-1', name: 'Support' },
              },
              {
                ticketCount: 2,
                queueId: 'q-2',
                queue: { id: 'q-2', name: 'Billing' },
              },
            ],
          },
        },
      ]);
      mockCount.mockResolvedValue(1);

      const result = await MemberService.getMembers({
        organizationId,
        queueId: '',
        queryString: {} as any,
      });

      expect(mockGetTenantClient).toHaveBeenCalledWith(organizationId);
      expect(result.total).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(0);
      expect(result.data).toEqual([
        {
          id: 'member-1',
          userId: 'user-1',
          email: 'alice@example.com',
          name: 'Alice',
          avatar: null,
          role: 'AGENT',
          roleId: 'role-1',
          createdAt: new Date('2024-01-01'),
          organizationId,
          totalTickets: 5,
          queues: [
            { queueId: 'q-1', name: 'Support', ticketCount: 3 },
            { queueId: 'q-2', name: 'Billing', ticketCount: 2 },
          ],
        },
      ]);
    });

    it('adds a queue filter when queueId is provided', async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await MemberService.getMembers({
        organizationId,
        queueId: 'q-1',
        queryString: {} as any,
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId,
            isSystem: false,
            user: { queueAgents: { some: { queueId: 'q-1' } } },
          }),
        }),
      );
    });

    it('does not add a queue filter when queueId is empty', async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await MemberService.getMembers({
        organizationId,
        queueId: '',
        queryString: {} as any,
      });

      const callArgs = mockFindMany.mock.calls[0][0];
      expect(callArgs.where.user).toBeUndefined();
    });
  });

  describe('updateRole', () => {
    it('updates the membership role and notifies the user', async () => {
      mockMembershipUpdate.mockResolvedValue({
        organizationId,
        role: { name: 'ADMIN' },
      });

      const result = await MemberService.updateRole({
        userId: 'user-1',
        roleId: 'role-2',
        organizationId,
      });

      expect(mockMembershipUpdate).toHaveBeenCalledWith({
        where: {
          organizationId_userId: { organizationId, userId: 'user-1' },
        },
        data: { roleId: 'role-2' },
        include: { role: { select: { name: true } } },
      });
      expect(mockSendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: 'user-1',
          userId: 'user-1',
          data: expect.objectContaining({
            title: 'Your role changed',
            message: 'Your role has been changed to ADMIN',
            type: 'RBAC',
          }),
        }),
      );
      expect(result).toEqual({ organizationId, role: { name: 'ADMIN' } });
    });
  });

  describe('assignQueue', () => {
    it('upserts the queue agent and notifies the user', async () => {
      mockQueueAgentUpsert.mockResolvedValue({
        organizationId,
        queueId: 'q-1',
        agentId: 'user-1',
      });

      const result = await MemberService.assignQueue({
        userId: 'user-1',
        queueId: 'q-1',
        organizationId,
      });

      expect(mockQueueAgentUpsert).toHaveBeenCalledWith({
        where: {
          queueId_agentId_organizationId: {
            queueId: 'q-1',
            agentId: 'user-1',
            organizationId,
          },
        },
        update: {},
        create: { queueId: 'q-1', agentId: 'user-1', organizationId },
      });
      expect(mockSendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Queue assigned',
            type: 'QUEUE',
          }),
        }),
      );
      expect(result).toEqual({
        organizationId,
        queueId: 'q-1',
        agentId: 'user-1',
      });
    });
  });

  describe('unassignedQueue', () => {
    it('deletes the queue agent and notifies the user', async () => {
      mockQueueAgentDelete.mockResolvedValue({
        organizationId,
        queueId: 'q-1',
        agentId: 'user-1',
      });

      await MemberService.unassignedQueue({
        organizationId,
        queueId: 'q-1',
        userId: 'user-1',
      });

      expect(mockQueueAgentDelete).toHaveBeenCalledWith({
        where: {
          queueId_agentId_organizationId: {
            queueId: 'q-1',
            agentId: 'user-1',
            organizationId,
          },
        },
      });
      expect(mockSendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Queue unassigned',
            type: 'QUEUE',
          }),
        }),
      );
    });
  });
});
