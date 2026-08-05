import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ActivityService } from './activity.service.js';
import { getTenantClient } from '@org/database';

// --- Mocks -----------------------------------------------------------------

vi.mock('@org/database', () => ({
  getTenantClient: vi.fn(),
}));

describe('ActivityService', () => {
  let mockTenantDb: any;

  beforeEach(() => {
    mockTenantDb = {
      activityLog: {
        create: vi.fn(),
        count: vi.fn(),
        findMany: vi.fn(),
        groupBy: vi.fn(),
      },
    };
    (getTenantClient as any).mockReturnValue(mockTenantDb);
    vi.clearAllMocks();
    (getTenantClient as any).mockReturnValue(mockTenantDb);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- lagActivity -----------------------------------------------------

  describe('lagActivity', () => {
    const baseInput = {
      organizationId: 'org_1',
      actorId: 'user_1',
      actorType: 'USER',
      entityId: 'entity_1',
      entityType: 'INVOICE',
      event: 'UPDATE',
      severity: 'INFO',
      message: 'Invoice updated',
      metadata: { foo: 'bar' },
      ipAddress: '127.0.0.1',
    };

    it('creates an activity log without a diff when oldData/newData are absent', async () => {
      mockTenantDb.activityLog.create.mockResolvedValue({ id: 'log_1' });

      const result = await ActivityService.lagActivity(baseInput as any);

      expect(getTenantClient).toHaveBeenCalledWith('org_1');
      expect(mockTenantDb.activityLog.create).toHaveBeenCalledWith({
        data: {
          organizationId: 'org_1',
          actorId: 'user_1',
          actorType: 'USER',
          entityId: 'entity_1',
          entityType: 'INVOICE',
          event: 'UPDATE',
          severity: 'INFO',
          changes: null,
          message: 'Invoice updated',
          metadata: { foo: 'bar' },
          ipAddress: '127.0.0.1',
        },
      });
      expect(result).toEqual({ id: 'log_1' });
    });

    it('computes a diff and passes it as changes when oldData/newData are provided', async () => {
      mockTenantDb.activityLog.create.mockResolvedValue({ id: 'log_2' });

      const oldData = { status: 'DRAFT', total: 100 };
      const newData = { status: 'PAID', total: 100 };

      await ActivityService.lagActivity({
        ...baseInput,
        oldData,
        newData,
      } as any);

      expect(mockTenantDb.activityLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            changes: { status: { from: 'DRAFT', to: 'PAID' } },
          }),
        }),
      );
    });

    it('passes changes as null when oldData/newData are identical', async () => {
      mockTenantDb.activityLog.create.mockResolvedValue({ id: 'log_3' });

      const oldData = { status: 'PAID' };
      const newData = { status: 'PAID' };

      await ActivityService.lagActivity({
        ...baseInput,
        oldData,
        newData,
      } as any);

      expect(mockTenantDb.activityLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ changes: null }),
        }),
      );
    });

    it('returns null and logs to console.error when the database call throws', async () => {
      const dbError = new Error('DB connection failed');
      mockTenantDb.activityLog.create.mockRejectedValue(dbError);

      const result = await ActivityService.lagActivity(baseInput as any);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to create activity log:',
        dbError,
      );
    });

    it('does not throw even if getTenantClient itself throws', async () => {
      (getTenantClient as any).mockImplementation(() => {
        throw new Error('tenant not found');
      });

      const result = await ActivityService.lagActivity(baseInput as any);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  // --- getDiff -----------------------------------------------------------

  describe('getDiff', () => {
    it('returns null when there are no differences', () => {
      const diff = ActivityService.getDiff({ a: 1, b: 2 }, { a: 1, b: 2 });
      expect(diff).toBeNull();
    });

    it('returns a diff object for changed primitive fields', () => {
      const diff = ActivityService.getDiff({ a: 1, b: 2 }, { a: 1, b: 3 });
      expect(diff).toEqual({ b: { from: 2, to: 3 } });
    });

    it('detects differences in nested objects via JSON comparison', () => {
      const diff = ActivityService.getDiff(
        { meta: { x: 1 } },
        { meta: { x: 2 } },
      );
      expect(diff).toEqual({
        meta: { from: { x: 1 }, to: { x: 2 } },
      });
    });

    it('only reports keys present in newData, ignoring keys only in oldData', () => {
      const diff = ActivityService.getDiff(
        { a: 1, removedField: 'gone' },
        { a: 1 },
      );
      expect(diff).toBeNull();
    });

    it('reports new keys added in newData that did not exist in oldData', () => {
      const diff = ActivityService.getDiff({ a: 1 }, { a: 1, c: 5 });
      expect(diff).toEqual({ c: { from: undefined, to: 5 } });
    });
  });

  // --- getActivityLogs -----------------------------------------------------

  describe('getActivityLogs', () => {
    it('returns paginated data along with pagination metadata', async () => {
      const mockWhere = { organizationId: 'org_1' };
      mockTenantDb.activityLog.count.mockResolvedValue(42);
      mockTenantDb.activityLog.findMany.mockResolvedValue([
        { id: 'log_1' },
        { id: 'log_2' },
      ]);

      const result = await ActivityService.getActivityLogs('org_1', {} as any);

      expect(getTenantClient).toHaveBeenCalledWith('org_1');
      expect(mockTenantDb.activityLog.count).toHaveBeenCalledWith({
        where: {},
      });
      expect(mockTenantDb.activityLog.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
      console.log(result);
      expect(result).toEqual({
        data: [{ id: 'log_1' }, { id: 'log_2' }],
        pagination: { total: 42, offset: 0, limit: 10 },
      });
    });

    it('propagates errors thrown by the database layer', async () => {
      mockTenantDb.activityLog.count.mockRejectedValue(new Error('boom'));

      await expect(
        ActivityService.getActivityLogs('org_1', {} as any),
      ).rejects.toThrow('boom');
    });
  });

  // --- getActivitySummary -----------------------------------------------------

  describe('getActivitySummary', () => {
    it('formats grouped counts into warn/info/error/total summary', async () => {
      mockTenantDb.activityLog.groupBy.mockResolvedValue([
        { severity: 'WARN', _count: { _all: 3 } },
        { severity: 'INFO', _count: { _all: 10 } },
        { severity: 'ERROR', _count: { _all: 1 } },
      ]);
      mockTenantDb.activityLog.count.mockResolvedValue(14);

      const result = await ActivityService.getActivitySummary('org_1');

      expect(mockTenantDb.activityLog.groupBy).toHaveBeenCalledWith({
        where: { organizationId: 'org_1' },
        by: 'severity',
        _count: { _all: true },
      });
      expect(result).toEqual({ warn: 3, info: 10, error: 1, total: 14 });
    });

    it('defaults missing severities to 0', async () => {
      mockTenantDb.activityLog.groupBy.mockResolvedValue([
        { severity: 'INFO', _count: { _all: 5 } },
      ]);
      mockTenantDb.activityLog.count.mockResolvedValue(5);

      const result = await ActivityService.getActivitySummary('org_1');

      expect(result).toEqual({ warn: 0, info: 5, error: 0, total: 5 });
    });

    it('returns all zeros when there are no logs', async () => {
      mockTenantDb.activityLog.groupBy.mockResolvedValue([]);
      mockTenantDb.activityLog.count.mockResolvedValue(0);

      const result = await ActivityService.getActivitySummary('org_1');

      expect(result).toEqual({ warn: 0, info: 0, error: 0, total: 0 });
    });
  });
});
