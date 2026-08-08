import { dashboardService } from './dashboard.service';

import { describe, it, expect, vi, beforeEach } from 'vitest';
const { mockGetTenantClient, mockGroupBy, mockCount, mockFindMany } =
  vi.hoisted(() => ({
    mockGetTenantClient: vi.fn(),
    mockGroupBy: vi.fn(),
    mockCount: vi.fn(),
    mockFindMany: vi.fn(),
  }));

vi.mock('@org/database', () => ({
  getTenantClient: mockGetTenantClient,
}));

describe('dashboardService', () => {
  const organizationId = 'org-1';

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenantClient.mockReturnValue({
      ticket: {
        groupBy: mockGroupBy,
        count: mockCount,
        findMany: mockFindMany,
      },
    });
  });

  describe('ticketSummary', () => {
    it('fills in counts from groupBy and zeroes out missing statuses', async () => {
      mockGroupBy.mockResolvedValue([
        { status: 'OPEN', _count: 3 },
        { status: 'CLOSED', _count: 2 },
      ]);
      mockCount.mockResolvedValue(5);

      const result = await dashboardService.ticketSummary(organizationId);

      expect(mockGetTenantClient).toHaveBeenCalledWith(organizationId);
      expect(result).toEqual({
        OPEN: 3,
        IN_PROGRESS: 0,
        RESOLVED: 0,
        CLOSED: 2,
        ON_HOLD: 0,
        REOPENED: 0,
        TOTAL: 5,
      });
    });

    it('scopes both queries to the organization', async () => {
      mockGroupBy.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await dashboardService.ticketSummary(organizationId);

      expect(mockGroupBy).toHaveBeenCalledWith(
        expect.objectContaining({ where: { organizationId } }),
      );
      expect(mockCount).toHaveBeenCalledWith({ where: { organizationId } });
    });
  });

  describe('getRecentTickets', () => {
    it('returns up to 5 recently updated tickets, newest first', async () => {
      const tickets = [
        { id: 't-1', code: 'T-1', subject: 'Issue A' },
        { id: 't-2', code: 'T-2', subject: 'Issue B' },
      ];
      mockFindMany.mockResolvedValue(tickets);

      const result = await dashboardService.getRecentTickets(organizationId);

      expect(mockGetTenantClient).toHaveBeenCalledWith(organizationId);
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { updatedAt: 'desc' },
          take: 5,
        }),
      );
      expect(result).toEqual(tickets);
    });
  });
});
