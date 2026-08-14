import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivityService } from '../../activity/activity.service';
import { NotificationService } from '../../notification/notification.service';
import { SocketService } from '../../socket/socket.service';
import { TicketCommentsService } from '../comments/comments.service';
import { TicketService } from '../ticket/ticket.service';
import { TicketTransitionService } from './ticketTransition.service';

// ---- Hoisted mocks ----
const {
  mockTicketFindUnique,
  mockTicketUpdateMany,
  mockQueueFindMany,
  mockQueueFindFirst,
  mockQueueAgentFindFirst,
  mockTicketTransitionCount,
  mockTicketTransitionFindMany,
  mockTransaction,
  mockTxTicketFindUnique,
  mockTxUpdateManyAndReturn,
  mockTxUpdateMany,
  mockTxQueueAgentUpdate,
  mockTxTicketTransitionCreate,
} = vi.hoisted(() => ({
  mockTicketFindUnique: vi.fn(),
  mockTicketUpdateMany: vi.fn(),
  mockQueueFindMany: vi.fn(),
  mockQueueFindFirst: vi.fn(),
  mockQueueAgentFindFirst: vi.fn(),
  mockTicketTransitionCount: vi.fn(),
  mockTicketTransitionFindMany: vi.fn(),
  mockTransaction: vi.fn(),
  mockTxTicketFindUnique: vi.fn(),
  mockTxUpdateManyAndReturn: vi.fn(),
  mockTxUpdateMany: vi.fn(),
  mockTxQueueAgentUpdate: vi.fn(),
  mockTxTicketTransitionCreate: vi.fn(),
}));

vi.mock('@org/database', () => ({
  getTenantClient: vi.fn(() => ({
    ticket: {
      findUnique: mockTicketFindUnique,
      updateMany: mockTicketUpdateMany,
    },
    queue: {
      findMany: mockQueueFindMany,
      findFirst: mockQueueFindFirst,
    },
    queueAgent: {
      findFirst: mockQueueAgentFindFirst,
    },
    ticketTransition: {
      count: mockTicketTransitionCount,
      findMany: mockTicketTransitionFindMany,
    },
    $transaction: mockTransaction,
  })),
  priority: { LOW: 'LOW', HIGH: 'HIGH' },
  Priority: { LOW: 'LOW', HIGH: 'HIGH' },
  TicketStatus: {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
    REOPENED: 'REOPENED',
    PENDING: 'PENDING',
  },
}));

vi.mock('@org/constants', () => ({
  allowedTransitions: {
    OPEN: ['PENDING', 'CLOSED'],
    PENDING: ['OPEN', 'CLOSED'],
    CLOSED: ['REOPENED'],
    REOPENED: ['CLOSED', 'OPEN'],
  },
}));

vi.mock('../../activity/activity.service', () => ({
  ActivityService: { lagActivity: vi.fn() },
}));

vi.mock('../../notification/notification.service', () => ({
  NotificationService: { sendNotification: vi.fn() },
}));

vi.mock('../../socket/socket.service', () => ({
  SocketService: { invlidOrganizationQuery: vi.fn() },
}));

vi.mock('../ticket/ticket.service', () => ({
  TicketService: {
    resolveAgentAssignment: vi.fn(),
    updateTicketMovement: vi.fn(),
  },
}));

vi.mock('../comments/comments.service', () => ({
  TicketCommentsService: { createTicketComment: vi.fn() },
}));

const mockedLagActivity = vi.mocked(ActivityService.lagActivity);
const mockedSendNotification = vi.mocked(NotificationService.sendNotification);
const mockedInvlidOrganizationQuery = vi.mocked(
  SocketService.invlidOrganizationQuery,
);
const mockedResolveAgentAssignment = vi.mocked(
  TicketService.resolveAgentAssignment,
);
const mockedUpdateTicketMovement = vi.mocked(
  TicketService.updateTicketMovement,
);
const mockedCreateTicketComment = vi.mocked(
  TicketCommentsService.createTicketComment,
);

describe('TicketTransitionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    mockTransaction.mockImplementation(async (callback: any) =>
      callback({
        ticket: {
          updateManyAndReturn: mockTxUpdateManyAndReturn,
          updateMany: mockTxUpdateMany,
          findUnique: mockTxTicketFindUnique,
        },
        queueAgent: { update: mockTxQueueAgentUpdate },
        ticketTransition: { create: mockTxTicketTransitionCreate },
      }),
    );
  });

  // ---------------------------------------------------------------------
  describe('updateStatus', () => {
    it('updates status, records a transition, logs activity, notifies the assignee, and invalidates socket cache', async () => {
      mockTicketFindUnique.mockResolvedValue({
        status: 'OPEN',
        queueId: 'queue_1',
        assignedTo: 'agent_1',
      });
      mockTxUpdateManyAndReturn.mockResolvedValue([
        { id: 'ticket_1', status: 'CLOSED' },
      ]);

      const result = await TicketTransitionService.updateStatus({
        ticketId: 'ticket_1',
        organizationId: 'org_1',
        nextStatus: 'CLOSED' as any,
        version: 3,
        userId: 'user_1',
      });

      expect(mockTxUpdateManyAndReturn).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'ticket_1', organizationId: 'org_1', version: 3 },
          data: expect.objectContaining({ status: 'CLOSED' }),
        }),
      );

      // CLOSED with queueId + assignedTo => decrement.
      expect(mockTxQueueAgentUpdate).toHaveBeenCalledWith({
        where: {
          queueId_agentId_organizationId: {
            organizationId: 'org_1',
            agentId: 'agent_1',
            queueId: 'queue_1',
          },
        },
        data: { ticketCount: { decrement: 1 } },
      });

      expect(mockTxTicketTransitionCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ticketId: 'ticket_1',
          action: 'STATUS_CHANGED',
          fromStatus: 'OPEN',
          toStatus: 'CLOSED',
          organizationId: 'org_1',
        }),
      });

      expect(mockedLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'ticket.update',
          oldData: { status: 'OPEN' },
          newData: { status: 'CLOSED' },
        }),
      );

      expect(mockedSendNotification).toHaveBeenCalledWith(
        expect.objectContaining({ recipientId: 'agent_1' }),
      );
      expect(mockedInvlidOrganizationQuery).toHaveBeenCalledWith({
        organizationId: 'org_1',
        keys: ['ticket'],
      });

      expect(result).toEqual({ id: 'ticket_1', status: 'CLOSED' });
    });

    it('increments queueAgent ticketCount on REOPENED', async () => {
      mockTicketFindUnique.mockResolvedValue({
        status: 'CLOSED',
        queueId: 'queue_1',
        assignedTo: 'agent_1',
      });
      mockTxUpdateManyAndReturn.mockResolvedValue([
        { id: 'ticket_1', status: 'REOPENED' },
      ]);

      await TicketTransitionService.updateStatus({
        ticketId: 'ticket_1',
        organizationId: 'org_1',
        nextStatus: 'REOPENED' as any,
        version: 1,
        userId: 'user_1',
      });

      expect(mockTxQueueAgentUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ data: { ticketCount: { increment: 1 } } }),
      );
    });

    it('does not touch queueAgent counts for transitions that are neither CLOSED nor REOPENED', async () => {
      mockTicketFindUnique.mockResolvedValue({
        status: 'OPEN',
        queueId: 'queue_1',
        assignedTo: 'agent_1',
      });
      mockTxUpdateManyAndReturn.mockResolvedValue([
        { id: 'ticket_1', status: 'PENDING' },
      ]);

      await TicketTransitionService.updateStatus({
        ticketId: 'ticket_1',
        organizationId: 'org_1',
        nextStatus: 'PENDING' as any,
        version: 1,
        userId: 'user_1',
      });

      expect(mockTxQueueAgentUpdate).not.toHaveBeenCalled();
    });

    it('throws 404 when the ticket does not exist', async () => {
      mockTicketFindUnique.mockResolvedValue(null);

      await expect(
        TicketTransitionService.updateStatus({
          ticketId: 'missing',
          organizationId: 'org_1',
          nextStatus: 'CLOSED' as any,
          version: 1,
          userId: 'user_1',
        }),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('throws 403 for a disallowed status transition', async () => {
      mockTicketFindUnique.mockResolvedValue({
        status: 'CLOSED',
        queueId: 'queue_1',
        assignedTo: 'agent_1',
      });

      await expect(
        TicketTransitionService.updateStatus({
          ticketId: 'ticket_1',
          organizationId: 'org_1',
          nextStatus: 'PENDING' as any, // CLOSED -> PENDING is not allowed per mocked map
          version: 1,
          userId: 'user_1',
        }),
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(mockTransaction).not.toHaveBeenCalled();
    });

    it('throws a domain error when currentData.status has no entry in allowedTransitions', async () => {
      mockTicketFindUnique.mockResolvedValue({
        status: 'SOME_UNMAPPED_STATUS',
        queueId: 'queue_1',
        assignedTo: 'agent_1',
      });

      await expect(
        TicketTransitionService.updateStatus({
          ticketId: 'ticket_1',
          organizationId: 'org_1',
          nextStatus: 'CLOSED' as any,
          version: 1,
          userId: 'user_1',
        }),
      ).rejects.toThrow('Invalid transition');
    });

    it('throws 409 VERSION_MISSMATCH when the version has moved on', async () => {
      mockTicketFindUnique.mockResolvedValue({
        status: 'OPEN',
        queueId: 'queue_1',
        assignedTo: 'agent_1',
      });
      mockTxUpdateManyAndReturn.mockResolvedValue([]); // no rows matched => stale version
      mockTxTicketFindUnique.mockResolvedValue({ version: 7 });

      await expect(
        TicketTransitionService.updateStatus({
          ticketId: 'ticket_1',
          organizationId: 'org_1',
          nextStatus: 'CLOSED' as any,
          version: 3,
          userId: 'user_1',
        }),
      ).rejects.toMatchObject({ statusCode: 409, code: 'VERSION_MISSMATCH' });

      // Correctly reads the retry-check via `tx`, not the outer client.
      expect(mockTxTicketFindUnique).toHaveBeenCalledWith({
        where: { id: 'ticket_1' },
        select: { version: true },
      });
    });

    it('does not notify when the ticket has no assignee', async () => {
      mockTicketFindUnique.mockResolvedValue({
        status: 'OPEN',
        queueId: null,
        assignedTo: null,
      });
      mockTxUpdateManyAndReturn.mockResolvedValue([
        { id: 'ticket_1', status: 'CLOSED' },
      ]);

      await TicketTransitionService.updateStatus({
        ticketId: 'ticket_1',
        organizationId: 'org_1',
        nextStatus: 'CLOSED' as any,
        version: 1,
        userId: 'user_1',
      });

      expect(mockedSendNotification).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------
  describe('updatePriority', () => {
    it('updates priority, records a transition, and logs activity', async () => {
      mockTxTicketFindUnique.mockResolvedValue({
        priority: 'LOW',
        assignedTo: 'agent_1',
      });
      mockTxUpdateManyAndReturn.mockResolvedValue([
        {
          id: 'ticket_1',
          priority: 'HIGH',
        },
      ]);

      const result = await TicketTransitionService.updatePriority({
        ticketId: 'ticket_1',
        organizationId: 'org_1',
        priority: 'HIGH' as any,
        version: 2,
        userId: 'user_1',
      });

      expect(mockTxUpdateManyAndReturn).toHaveBeenCalledWith({
        where: { id: 'ticket_1', organizationId: 'org_1', version: 2 },
        data: { priority: 'HIGH', version: { increment: 1 } },
      });

      expect(mockTxTicketTransitionCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'PRIORITY_CHANGED',
          toPriority: 'HIGH',
          fromPriority: 'LOW',
        }),
      });

      expect(mockedLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          oldData: { priority: 'LOW' },
          newData: { priority: 'HIGH' },
        }),
      );

      expect(result).toEqual({ id: 'ticket_1', priority: 'HIGH' });
    });

    it('notifies the assignee when present', async () => {
      mockTicketFindUnique.mockResolvedValue({
        priority: 'LOW',
        assignedTo: 'agent_1',
      });
      mockTxUpdateMany.mockResolvedValue({ count: 1 });

      await TicketTransitionService.updatePriority({
        ticketId: 'ticket_1',
        organizationId: 'org_1',
        priority: 'HIGH' as any,
        version: 1,
        userId: 'user_1',
      });

      expect(mockedSendNotification).toHaveBeenCalledWith(
        expect.objectContaining({ recipientId: 'agent_1' }),
      );
    });

    it('does not notify when there is no assignee', async () => {
      mockTxTicketFindUnique.mockResolvedValue({
        priority: 'LOW',
        assignedTo: null,
      });
      mockTxUpdateMany.mockResolvedValue({ count: 1 });

      await TicketTransitionService.updatePriority({
        ticketId: 'ticket_1',
        organizationId: 'org_1',
        priority: 'HIGH' as any,
        version: 1,
        userId: 'user_1',
      });

      expect(mockedSendNotification).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------
  describe('escalateTicket', () => {
    const baseInput = {
      priority: 'HIGH' as any,
      reason: 'SLA breach',
      comment: 'Escalating',
    };

    it('escalates to the next queue in the current group when no groupId is given', async () => {
      mockTicketFindUnique.mockResolvedValue({
        id: 'ticket_1',
        queue: { queueGroupId: 'group_1', order: 1 },
      });

      vi.spyOn(TicketTransitionService, 'escalationOptions').mockResolvedValue({
        currentQueue: {
          id: 'queue_1',
          name: 'Tier 1',
          order: 1,
        },
        nextQueue: { id: 'queue_2', name: 'Tier 2', order: 2 },
      } as any);

      mockedResolveAgentAssignment.mockResolvedValue('agent_2');
      mockedUpdateTicketMovement.mockResolvedValue({
        updatedTicket: { id: 'ticket_1', code: 'TKT-1', assignedTo: 'agent_2' },
        currentTicket: { id: 'ticket_1' },
      } as any);

      const result = await TicketTransitionService.escalateTicket({
        ticketId: 'ticket_1',
        organizationId: 'org_1',
        userId: 'user_1',
        input: baseInput,
      });

      expect(TicketTransitionService.escalationOptions).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId: 'org_1',
          ticketId: 'ticket_1',
        }),
      );
      expect(mockedResolveAgentAssignment).toHaveBeenCalledWith({
        queueId: 'queue_2',
        organizationId: 'org_1',
      });
      expect(mockedUpdateTicketMovement).toHaveBeenCalledWith(
        expect.objectContaining({
          nextQueueId: 'queue_2',
          nextAgentId: 'agent_2',
          action: 'ESCALATED',
          reason: 'SLA breach',
        }),
      );
      expect(mockedCreateTicketComment).toHaveBeenCalledWith(
        expect.objectContaining({ comment: 'Escalating' }),
      );
      expect(mockedSendNotification).toHaveBeenCalledWith(
        expect.objectContaining({ recipientId: 'agent_2' }),
      );
      expect(result).toEqual({
        id: 'ticket_1',
        code: 'TKT-1',
        assignedTo: 'agent_2',
      });
    });

    it('throws 400 when no groupId is given and the ticket has no current queue', async () => {
      mockTicketFindUnique.mockResolvedValue({ id: 'ticket_1', queue: null });

      vi.spyOn(TicketTransitionService, 'escalationOptions').mockResolvedValue({
        currentQueue: null,
        nextQueue: null,
      } as any);

      await expect(
        TicketTransitionService.escalateTicket({
          ticketId: 'ticket_1',
          organizationId: 'org_1',
          userId: 'user_1',
          input: baseInput,
        }),
      ).rejects.toMatchObject({ statusCode: 400, code: 'INVALID_PAYLOAD' });
    });

    // BUG #6: ticket not found is misreported as "select a group".
    it('return "ticket not found" (404) when the ticket does not exist', async () => {
      mockTicketFindUnique.mockResolvedValue(null);

      await expect(
        TicketTransitionService.escalateTicket({
          ticketId: 'missing',
          organizationId: 'org_1',
          userId: 'user_1',
          input: baseInput,
        }),
      ).rejects.toMatchObject({ statusCode: 404, code: 'NOT_FOUND' });
    });

    it('throws 409 when no further queue has any agents', async () => {
      mockTicketFindUnique.mockResolvedValue({
        id: 'ticket_1',
        queue: { queueGroupId: 'group_1', order: 1 },
      });

      vi.spyOn(TicketTransitionService, 'escalationOptions').mockResolvedValue({
        currentQueue: { id: 'queue_1', name: 'Tier 1', order: 1 },
        nextQueue: { id: 'q2', name: 'Tier 2', order: 2 },
      } as any);

      mockedResolveAgentAssignment.mockResolvedValue(undefined);

      await expect(
        TicketTransitionService.escalateTicket({
          ticketId: 'ticket_1',
          organizationId: 'org_1',
          userId: 'user_1',
          input: baseInput,
        }),
      ).rejects.toMatchObject({ statusCode: 409, code: 'CONFLICT_ERROR' });
    });

    it('throws 409 when no agent can be resolved for the next queue', async () => {
      mockTicketFindUnique.mockResolvedValue({
        id: 'ticket_1',
        queue: { queueGroupId: 'group_1', order: 1 },
      });

      vi.spyOn(TicketTransitionService, 'escalationOptions').mockResolvedValue({
        currentQueue: { id: 'queue_1', name: 'Tier 1', order: 1 },
        nextQueue: { id: 'q2', name: 'Tier 2', order: 2 },
      } as any);

      mockedResolveAgentAssignment.mockResolvedValue(undefined);

      await expect(
        TicketTransitionService.escalateTicket({
          ticketId: 'ticket_1',
          organizationId: 'org_1',
          userId: 'user_1',
          input: baseInput,
        }),
      ).rejects.toMatchObject({ statusCode: 409, code: 'CONFLICT_ERROR' });
    });
  });

  // ---------------------------------------------------------------------
  describe('assignTicket', () => {
    it('throw Error when Agent not found in queue', async () => {
      mockQueueAgentFindFirst.mockResolvedValue({
        queueId: 'queue_1',
        agnetId: 'agent_9',
      });

      await expect(
        TicketTransitionService.assignTicket({
          ticketId: 'ticket_1',
          organizationId: 'org_1',
          assignId: 'agent_9', // brand-new agent, never assigned before
          targetType: 'AGENT',
          userId: 'user_1',
        }),
      ).rejects.toThrow('Agent not found in queue');

      expect(mockedUpdateTicketMovement).not.toHaveBeenCalled();
    });

    it('throws 400 for an invalid targetType', async () => {
      await expect(
        TicketTransitionService.assignTicket({
          ticketId: 'ticket_1',
          organizationId: 'org_1',
          assignId: 'x',
          targetType: 'BOGUS' as any,
          userId: 'user_1',
        }),
      ).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  // ---------------------------------------------------------------------
  describe('escalationOptions', () => {
    it('returns null for both queues when the ticket has no queue', async () => {
      mockTicketFindUnique.mockResolvedValue({ queue: null });

      const result = await TicketTransitionService.escalationOptions({
        organizationId: 'org_1',
        ticketId: 'ticket_1',
      });

      expect(result).toEqual({ currentQueue: null, nextQueue: null });
    });

    it('returns the current and next queue when order + 1 exists', async () => {
      mockTicketFindUnique.mockResolvedValue({
        queue: { id: 'q1', name: 'Tier 1', queueGroupId: 'group_1', order: 1 },
      });
      mockQueueFindFirst.mockResolvedValue({
        id: 'q2',
        name: 'Tier 2',
        order: 2,
      });

      const result = await TicketTransitionService.escalationOptions({
        organizationId: 'org_1',
        ticketId: 'ticket_1',
      });

      expect(mockQueueFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            organizationId: 'org_1',
            queueGroupId: 'group_1',
            order: { gt: 1 },
            active: true,
          },
        }),
      );

      expect(result).toEqual({
        currentQueue: { id: 'q1', name: 'Tier 1', order: 1 },
        nextQueue: { id: 'q2', name: 'Tier 2', order: 2 },
        groupIdRequired: false,
      });
    });

    it('does not query for a next queue when order is null', async () => {
      mockTicketFindUnique.mockResolvedValue({
        queue: {
          id: 'q1',
          name: 'Tier 1',
          queueGroupId: 'group_1',
          order: null,
        },
      });

      const result = await TicketTransitionService.escalationOptions({
        organizationId: 'org_1',
        ticketId: 'ticket_1',
      });

      expect(mockQueueFindFirst).not.toHaveBeenCalled();
      expect(result.nextQueue).toBeNull();
    });
  });

  // ---------------------------------------------------------------------
  describe('getTicketTransitionHistory', () => {
    it('returns paginated transition history with default pagination', async () => {
      mockTicketTransitionCount.mockResolvedValue(2);
      mockTicketTransitionFindMany.mockResolvedValue([
        { action: 'STATUS_CHANGED', fromStatus: 'OPEN', toStatus: 'CLOSED' },
      ]);

      const result = await TicketTransitionService.getTicketTransitionHistory({
        ticketId: 'ticket_1',
        organizationId: 'org_1',
        queryString: {},
      });

      expect(mockTicketTransitionFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { organizationId: 'org_1', ticketId: 'ticket_1' },
          orderBy: { createdAt: 'desc' },
        }),
      );
      expect(result).toEqual({
        data: [
          { action: 'STATUS_CHANGED', fromStatus: 'OPEN', toStatus: 'CLOSED' },
        ],
        pagination: { offset: 0, limit: 10, total: 2 },
      });
    });
  });
});
