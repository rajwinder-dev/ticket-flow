import { QueueService } from './queue.service';

const {
  mockGetTenantClient,
  mockQueueFindMany,
  mockQueueCount,
  mockQueueCreate,
  mockQueueFindUnique,
  mockQueueFindFirst,
  mockQueueUpdate,
  mockTicketCount,
  mockQueueAgentCount,
  mockQueueAgentFindMany,
  mockQueueAgentCreateManyAndReturn,
  mockQueueAgentUpdateManyAndReturn,
  mockUserFindMany,
  mockLagActivity,
} = vi.hoisted(() => ({
  mockGetTenantClient: vi.fn(),
  mockQueueFindMany: vi.fn(),
  mockQueueCount: vi.fn(),
  mockQueueCreate: vi.fn(),
  mockQueueFindUnique: vi.fn(),
  mockQueueFindFirst: vi.fn(),
  mockQueueUpdate: vi.fn(),
  mockTicketCount: vi.fn(),
  mockQueueAgentCount: vi.fn(),
  mockQueueAgentFindMany: vi.fn(),
  mockQueueAgentCreateManyAndReturn: vi.fn(),
  mockQueueAgentUpdateManyAndReturn: vi.fn(),
  mockUserFindMany: vi.fn(),
  mockLagActivity: vi.fn(),
}));

vi.mock('@org/database', () => ({
  getTenantClient: mockGetTenantClient,
}));

vi.mock('../activity/activity.service.js', () => ({
  ActivityService: {
    lagActivity: mockLagActivity,
  },
}));

describe('QueueService', () => {
  const organizationId = 'org-1';

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenantClient.mockReturnValue({
      queue: {
        findMany: mockQueueFindMany,
        count: mockQueueCount,
        create: mockQueueCreate,
        findUnique: mockQueueFindUnique,
        findFirst: mockQueueFindFirst,
        update: mockQueueUpdate,
      },
      ticket: {
        count: mockTicketCount,
      },
      queueAgent: {
        count: mockQueueAgentCount,
        findMany: mockQueueAgentFindMany,
        createManyAndReturn: mockQueueAgentCreateManyAndReturn,
        updateManyAndReturn: mockQueueAgentUpdateManyAndReturn,
      },
      user: {
        findMany: mockUserFindMany,
      },
    });
  });

  describe('getQueues', () => {
    it('maps queue records and returns pagination info', async () => {
      mockQueueFindMany.mockResolvedValue([
        {
          id: 'q-1',
          name: 'Support',
          description: 'General support',
          order: 1,
          createdAt: new Date('2024-01-01'),
          _count: { queueAgents: 2 },
          queueAgents: [{ queue: { _count: { ticket: 5 } } }],
        },
      ]);
      mockQueueCount.mockResolvedValue(1);

      const result = await QueueService.getQueues({
        organizationId,
        groupId: 'group-1',
        queryString: {} as any,
      });

      expect(mockGetTenantClient).toHaveBeenCalledWith(organizationId);
      expect(result.pagination).toEqual({ total: 1, limit: 10, offset: 0 });
      expect(result.data).toEqual([
        {
          id: 'q-1',
          name: 'Support',
          description: 'General support',
          order: 1,
          agentsCount: 2,
          ticketsCount: 5,
          createdAt: new Date('2024-01-01'),
        },
      ]);
    });
  });

  describe('create', () => {
    it('assigns the next order and creates the queue', async () => {
      mockQueueCount.mockResolvedValue(2);
      mockQueueCreate.mockResolvedValue({
        id: 'q-1',
        name: 'Billing',
        order: 3,
      });

      const result = await QueueService.create({
        organizationId,
        queueGroupId: 'group-1',
        input: { name: 'Billing' } as any,
        userId: 'user-1',
      });

      expect(mockQueueCreate).toHaveBeenCalledWith({
        data: {
          organizationId,
          queueGroupId: 'group-1',
          order: 3,
          name: 'Billing',
        },
      });
      expect(mockLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'queue.create', entityId: 'q-1' }),
      );
      expect(result).toEqual({ id: 'q-1', name: 'Billing', order: 3 });
    });
  });

  describe('getDetails', () => {
    it('returns the queue with its group info', async () => {
      mockQueueFindUnique.mockResolvedValue({
        id: 'q-1',
        name: 'Support',
        queueGroup: { id: 'group-1', name: 'Tier 1' },
      });

      const result = await QueueService.getDetails({
        queueId: 'q-1',
        organizationId,
      });

      expect(mockQueueFindUnique).toHaveBeenCalledWith({
        where: { id: 'q-1', organizationId },
        include: { queueGroup: { select: { name: true, id: true } } },
      });
      expect(result).toEqual({
        id: 'q-1',
        name: 'Support',
        queueGroup: { id: 'group-1', name: 'Tier 1' },
      });
    });

    it('returns null when the queue does not exist', async () => {
      mockQueueFindUnique.mockResolvedValue(null);

      const result = await QueueService.getDetails({
        queueId: 'missing',
        organizationId,
      });

      expect(result).toBeNull();
    });
  });

  describe('getQueueSummary', () => {
    it('aggregates ticket and agent counts', async () => {
      mockTicketCount
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(4) // open
        .mockResolvedValueOnce(2); // high priority
      mockQueueAgentCount.mockResolvedValue(3);

      const result = await QueueService.getQueueSummary({
        queueId: 'q-1',
        organizationId,
      });

      expect(result).toEqual({
        totalTickets: 10,
        openTickets: 4,
        highPriorityTickets: 2,
        activeAgents: 3,
      });
    });
  });

  describe('addAgents', () => {
    it('assigns new agents and logs activity', async () => {
      mockQueueAgentFindMany.mockResolvedValue([]); // no one already assigned
      mockQueueAgentCreateManyAndReturn.mockResolvedValue([
        { queueId: 'q-1', agentId: 'agent-1', organizationId },
      ]);

      const result = await QueueService.addAgents({
        queueId: 'q-1',
        organizationId,
        agentIds: ['agent-1'],
        userId: 'user-1',
      });

      expect(mockQueueAgentCreateManyAndReturn).toHaveBeenCalledWith({
        data: [{ queueId: 'q-1', agentId: 'agent-1', organizationId }],
        skipDuplicates: true,
      });
      expect(mockLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'queue.agents.added' }),
      );
      expect(result).toEqual([
        { queueId: 'q-1', agentId: 'agent-1', organizationId },
      ]);
    });

    it('throws a conflict error when an agent is already assigned elsewhere', async () => {
      mockQueueAgentFindMany.mockResolvedValue([{ agentId: 'agent-1' }]);
      mockUserFindMany.mockResolvedValue([
        { id: 'agent-1', email: 'agent1@example.com' },
      ]);

      await expect(
        QueueService.addAgents({
          queueId: 'q-1',
          organizationId,
          agentIds: ['agent-1'],
          userId: 'user-1',
        }),
      ).rejects.toMatchObject({
        message: 'Some Agents are already assigned to other queues',
        statusCode: 400,
        code: 'CONFLICT_ERROR',
      });

      expect(mockQueueAgentCreateManyAndReturn).not.toHaveBeenCalled();
    });
  });

  describe('removeAgents', () => {
    it('deactivates agents and logs activity', async () => {
      mockQueueAgentFindMany.mockResolvedValue([
        { agentId: 'agent-1', active: true },
      ]);
      mockQueueAgentUpdateManyAndReturn.mockResolvedValue([
        { agentId: 'agent-1', active: false },
      ]);

      const result = await QueueService.removeAgents({
        queueId: 'q-1',
        organizationId,
        agentIds: ['agent-1'],
        userId: 'user-1',
      });

      expect(mockQueueAgentUpdateManyAndReturn).toHaveBeenCalledWith(
        expect.objectContaining({ data: { active: false } }),
      );
      expect(mockLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'queue.agent.remove' }),
      );
      expect(result).toEqual([{ agentId: 'agent-1', active: false }]);
    });
  });

  describe('getQueueAgents', () => {
    it('maps agents into a flattened shape', async () => {
      mockQueueAgentFindMany.mockResolvedValue([
        {
          user: {
            id: 'user-1',
            name: 'Alice',
            email: 'alice@example.com',
            active: true,
            _count: { ticketsAssigned: 3 },
            membership: [{ role: { id: 'role-1', name: 'AGENT' } }],
          },
        },
      ]);

      const result = await QueueService.getQueueAgents({
        queueId: 'q-1',
        organizationId,
      });

      expect(result).toEqual([
        {
          id: 'user-1',
          name: 'Alice',
          email: 'alice@example.com',
          active: true,
          role: 'AGENT',
          ticketCount: 3,
        },
      ]);
    });
  });

  describe('update', () => {
    it('updates the queue and logs activity', async () => {
      mockQueueUpdate.mockResolvedValue({ id: 'q-1', name: 'Renamed' });

      const result = await QueueService.update({
        queueId: 'q-1',
        organizationId,
        input: { name: 'Renamed' } as any,
        userId: 'user-1',
      });

      expect(mockQueueUpdate).toHaveBeenCalledWith({
        where: { id: 'q-1', organizationId, active: true },
        data: { name: 'Renamed' },
      });
      expect(mockLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'queue.update' }),
      );
      expect(result).toEqual({ id: 'q-1', name: 'Renamed' });
    });
  });

  describe('delete', () => {
    it('throws 404 when the queue does not exist', async () => {
      mockQueueFindUnique.mockResolvedValue(null);

      await expect(
        QueueService.delete({
          queueId: 'q-1',
          organizationId,
          userId: 'user-1',
        }),
      ).rejects.toMatchObject({ statusCode: 404, code: 'NOT_FOUND' });
    });

    it('throws a conflict when the queue is already deleted', async () => {
      mockQueueFindUnique.mockResolvedValue({ active: false });

      await expect(
        QueueService.delete({
          queueId: 'q-1',
          organizationId,
          userId: 'user-1',
        }),
      ).rejects.toMatchObject({ statusCode: 409, code: 'CONFLICT_ERROR' });
    });

    it('throws when the queue has active tickets', async () => {
      mockQueueFindUnique.mockResolvedValue({ active: true });
      mockTicketCount.mockResolvedValue(2);

      await expect(
        QueueService.delete({
          queueId: 'q-1',
          organizationId,
          userId: 'user-1',
        }),
      ).rejects.toMatchObject({
        message: 'Cannot delete queue with active tickets',
        statusCode: 400,
      });

      expect(mockQueueUpdate).not.toHaveBeenCalled();
    });

    it('soft-deletes the queue, reorders remaining queues, and logs activity', async () => {
      mockQueueFindUnique.mockResolvedValue({ active: true });
      mockTicketCount.mockResolvedValue(0);
      mockQueueUpdate.mockResolvedValueOnce({
        active: false,
        queueGroupId: 'group-1',
      });
      mockQueueFindMany.mockResolvedValue([
        { id: 'q-2', order: 2 },
        { id: 'q-3', order: 3 },
      ]);

      await QueueService.delete({
        queueId: 'q-1',
        organizationId,
        userId: 'user-1',
      });

      // q-2 should become order 1, q-3 should become order 2
      expect(mockQueueUpdate).toHaveBeenCalledWith({
        where: { id: 'q-2' },
        data: { order: 1 },
      });
      expect(mockQueueUpdate).toHaveBeenCalledWith({
        where: { id: 'q-3' },
        data: { order: 2 },
      });
      expect(mockLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'queue.delete' }),
      );
    });
  });

  describe('getLowerOrderQueue', () => {
    it('returns the id of the lowest-order active queue', async () => {
      mockQueueFindFirst.mockResolvedValue({ id: 'q-1' });

      const result = await QueueService.getLowerOrderQueue({
        queueGroupId: 'group-1',
        organizationId,
      });

      expect(mockQueueFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { queueGroupId: 'group-1', organizationId, active: true },
          orderBy: { order: 'asc' },
        }),
      );
      expect(result).toBe('q-1');
    });

    it('returns undefined when no active queue exists', async () => {
      mockQueueFindFirst.mockResolvedValue(null);

      const result = await QueueService.getLowerOrderQueue({
        queueGroupId: 'group-1',
        organizationId,
      });

      expect(result).toBeUndefined();
    });
  });
});
