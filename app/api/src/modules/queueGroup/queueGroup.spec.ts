import { QueueGroupService } from './queueGroup.service';
import { APIFeatures } from '../../core/utils/apiFeatures.js';

const {
  mockGetTenantClient,
  mockQueueGroupFindFirst,
  mockQueueGroupCreate,
  mockQueueGroupFindMany,
  mockQueueGroupCount,
  mockQueueGroupUpdate,
  mockQueueGroupUpdateMany,
  mockQueueCount,
  mockLagActivity,
  mockTransaction,
  mockTxQueueGroupFindFirst,
  mockTxQueueGroupUpdateMany,
  mockTxQueueGroupUpdate,
} = vi.hoisted(() => ({
  mockGetTenantClient: vi.fn(),
  mockQueueGroupFindFirst: vi.fn(),
  mockQueueGroupCreate: vi.fn(),
  mockQueueGroupFindMany: vi.fn(),
  mockQueueGroupCount: vi.fn(),
  mockQueueGroupUpdate: vi.fn(),
  mockQueueGroupUpdateMany: vi.fn(),
  mockQueueCount: vi.fn(),
  mockLagActivity: vi.fn(),
  mockTransaction: vi.fn(),
  mockTxQueueGroupFindFirst: vi.fn(),
  mockTxQueueGroupUpdateMany: vi.fn(),
  mockTxQueueGroupUpdate: vi.fn(),
}));

vi.mock('@org/database', () => ({
  getTenantClient: mockGetTenantClient,
}));

vi.mock('../activity/activity.service.js', () => ({
  ActivityService: {
    lagActivity: mockLagActivity,
  },
}));

describe('QueueGroupService', () => {
  const organizationId = 'org-1';
  const userId = 'user-1';

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenantClient.mockReturnValue({
      queueGroup: {
        findFirst: mockQueueGroupFindFirst,
        create: mockQueueGroupCreate,
        findMany: mockQueueGroupFindMany,
        count: mockQueueGroupCount,
        update: mockQueueGroupUpdate,
        updateMany: mockQueueGroupUpdateMany,
      },
      queue: {
        count: mockQueueCount,
      },
      $transaction: mockTransaction,
    });
    // Default: run the callback against a tx object backed by its own mocks.
    mockTransaction.mockImplementation(async (fn: any) =>
      fn({
        queueGroup: {
          findFirst: mockTxQueueGroupFindFirst,
          updateMany: mockTxQueueGroupUpdateMany,
          update: mockTxQueueGroupUpdate,
        },
      }),
    );
  });

  describe('createQueueGroup', () => {
    it('marks the group as default when no default group exists yet', async () => {
      mockQueueGroupFindFirst.mockResolvedValue(null);
      mockQueueGroupCreate.mockResolvedValue({ id: 'group-1', default: true });

      const result = await QueueGroupService.createQueueGroup({
        userId,
        organizationId,
        input: { name: 'Tier 1', description: 'First line support' } as any,
      });

      expect(mockQueueGroupCreate).toHaveBeenCalledWith({
        data: {
          organizationId,
          createdBy: userId,
          default: true,
          name: 'Tier 1',
          description: 'First line support',
        },
      });
      expect(mockLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'queueGroup.create',
          entityId: 'group-1',
        }),
      );
      expect(result).toEqual({ id: 'group-1', default: true });
    });

    it('does not mark the group as default when a default group already exists', async () => {
      mockQueueGroupFindFirst.mockResolvedValue({
        id: 'group-0',
        default: true,
      });
      mockQueueGroupCreate.mockResolvedValue({ id: 'group-1', default: false });

      await QueueGroupService.createQueueGroup({
        userId,
        organizationId,
        input: { name: 'Tier 2' } as any,
      });

      expect(mockQueueGroupCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ default: false }),
        }),
      );
    });
  });

  describe('getAllQueueGroups', () => {
    it('maps queue groups with derived counts and pagination', async () => {
      mockQueueGroupFindMany.mockResolvedValue([
        {
          id: 'group-1',
          name: 'Tier 1',
          description: 'First line',
          default: true,
          _count: { queues: 2 },
          queues: [
            { _count: { queueAgents: 3 } },
            { _count: { queueAgents: 1 } },
          ],
        },
      ]);
      mockQueueGroupCount.mockResolvedValue(1);

      const result = await QueueGroupService.getAllQueueGroups(
        organizationId,
        {} as any,
      );

      expect(result.pagination).toEqual({ total: 1, limit: 10, offset: 0 });
      expect(result.data).toEqual([
        {
          id: 'group-1',
          name: 'Tier 1',
          description: 'First line',
          queueCount: 2,
          queueAgentsCount: 4,
          default: true,
        },
      ]);
    });
  });

  describe('updateQueueGroup', () => {
    it('updates name/description and logs activity', async () => {
      mockQueueGroupUpdate.mockResolvedValue({
        id: 'group-1',
        name: 'Renamed',
        description: 'New description',
      });

      const result = await QueueGroupService.updateQueueGroup({
        groupId: 'group-1',
        organizationId,
        userId,
        input: { name: 'Renamed', description: 'New description' } as any,
      });

      expect(mockQueueGroupUpdate).toHaveBeenCalledWith({
        where: { id: 'group-1', organizationId },
        data: { name: 'Renamed', description: 'New description' },
      });
      expect(mockLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'queueGroup.update' }),
      );
      expect(result).toEqual({
        id: 'group-1',
        name: 'Renamed',
        description: 'New description',
      });
    });
  });

  describe('deleteQueueGroup', () => {
    it('throws a conflict when the group still has active queues', async () => {
      mockQueueCount.mockResolvedValue(2);

      await expect(
        QueueGroupService.deleteQueueGroup({
          groupId: 'group-1',
          organizationId,
          userId,
        }),
      ).rejects.toMatchObject({
        message: 'Cannot delete queue group with active queues',
        statusCode: 400,
        code: 'CONFLICT_ERROR',
      });

      expect(mockQueueGroupUpdate).not.toHaveBeenCalled();
    });

    it('deactivates the group and logs activity when there are no active queues', async () => {
      mockQueueCount.mockResolvedValue(0);
      mockQueueGroupUpdate.mockResolvedValue({ id: 'group-1', active: false });

      await QueueGroupService.deleteQueueGroup({
        groupId: 'group-1',
        organizationId,
        userId,
      });

      expect(mockQueueGroupUpdate).toHaveBeenCalledWith({
        where: { id: 'group-1', organizationId },
        data: { active: false },
      });
      expect(mockLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'queueGroup.delete' }),
      );
    });
  });

  describe('setDefaultGroup', () => {
    it('runs the read, clear-all, and set-new steps inside a single transaction', async () => {
      mockTxQueueGroupFindFirst.mockResolvedValue({ default: false });
      mockTxQueueGroupUpdate.mockResolvedValue({ default: true });

      const result = await QueueGroupService.setDefaultGroup({
        groupId: 'group-2',
        organizationId,
        userId,
      });

      expect(mockGetTenantClient).toHaveBeenCalledWith(organizationId);
      expect(mockTransaction).toHaveBeenCalledTimes(1);
      expect(mockTxQueueGroupFindFirst).toHaveBeenCalledWith({
        where: { organizationId, id: 'group-2' },
        select: { default: true },
      });
      expect(mockTxQueueGroupUpdateMany).toHaveBeenCalledWith({
        where: { organizationId },
        data: { default: false },
      });
      expect(mockTxQueueGroupUpdate).toHaveBeenCalledWith({
        where: { id: 'group-2', organizationId },
        data: { default: true },
        select: { default: true },
      });
      // None of the standalone (non-tx) mocks should be used anymore.
      expect(mockQueueGroupFindFirst).not.toHaveBeenCalled();
      expect(mockQueueGroupUpdateMany).not.toHaveBeenCalled();
      expect(mockQueueGroupUpdate).not.toHaveBeenCalled();
      expect(result).toEqual({ default: true });
    });

    it('logs the previous and new default state as old/new data', async () => {
      mockTxQueueGroupFindFirst.mockResolvedValue({ default: false });
      mockTxQueueGroupUpdate.mockResolvedValue({ default: true });

      await QueueGroupService.setDefaultGroup({
        groupId: 'group-2',
        organizationId,
        userId,
      });

      expect(mockLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId,
          actorId: userId,
          event: 'queueGroup.default',
          entityId: 'group-2',
          oldData: { default: false },
          newData: { default: true },
        }),
      );
    });

    it('rolls back and does not log activity when the transaction fails', async () => {
      const txError = new Error('update failed');
      mockTransaction.mockRejectedValue(txError);

      await expect(
        QueueGroupService.setDefaultGroup({
          groupId: 'group-2',
          organizationId,
          userId,
        }),
      ).rejects.toThrow(txError);

      expect(mockLagActivity).not.toHaveBeenCalled();
    });
  });

  describe('getDefaultGroup', () => {
    it('returns the id of the active default group', async () => {
      mockQueueGroupFindFirst.mockResolvedValue({ id: 'group-1' });

      const result = await QueueGroupService.getDefaultGroup(organizationId);

      expect(mockQueueGroupFindFirst).toHaveBeenCalledWith({
        where: { organizationId, default: true, active: true },
        select: { id: true },
      });
      expect(result).toBe('group-1');
    });

    it('returns undefined when there is no active default group', async () => {
      mockQueueGroupFindFirst.mockResolvedValue(null);

      const result = await QueueGroupService.getDefaultGroup(organizationId);

      expect(result).toBeUndefined();
    });
  });
});
