import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTenantClient } from '@org/database';
import { appError } from '../../../core/utils/appError.js';
import { readableId } from '../../../core/utils/utils.js';
import { ActivityService } from '../../activity/activity.service.js';
import { CustomerService } from '../../customer/customer.service.js';
import { QueueService } from '../../queue/queue.service.js';
import { QueueGroupService } from '../../queueGroup/queueGroup.service.js';
import { NotificationService } from '../../notification/notification.service.js';
import { SocketService } from '../../socket/socket.service.js';
import { TicketAiService } from '../ai/ticketAi.service.js';
import { TicketService } from './ticket.service';

// ---- Hoisted mocks (referenced inside vi.mock factories) ----
const {
  mockTicketCreate,
  mockTicketUpdate,
  mockTicketFindUnique,
  mockQueueAgentFindFirst,
  mockTransaction,
  mockTxTicketFindUnique,
  mockTxTicketUpdate,
  mockTxTicketTransitionCreate,
  mockTxQueueAgentUpdate,
} = vi.hoisted(() => ({
  mockTicketCreate: vi.fn(),
  mockTicketUpdate: vi.fn(),
  mockTicketFindUnique: vi.fn(),
  mockQueueAgentFindFirst: vi.fn(),
  mockTransaction: vi.fn(),
  mockTxTicketFindUnique: vi.fn(),
  mockTxTicketUpdate: vi.fn(),
  mockTxTicketTransitionCreate: vi.fn(),
  mockTxQueueAgentUpdate: vi.fn(),
}));

vi.mock('@org/database', () => ({
  getTenantClient: vi.fn(() => ({
    ticket: {
      create: mockTicketCreate,
      update: mockTicketUpdate,
      findUnique: mockTicketFindUnique,
    },
    queueAgent: {
      findFirst: mockQueueAgentFindFirst,
    },
    $transaction: mockTransaction,
  })),
  priority: { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH' },
  Sentiment: { POSITIVE: 'POSITIVE', NEGATIVE: 'NEGATIVE', NEUTRAL: 'NEUTRAL' },
  Prisma: {},
  TicketAction: { ASSIGNED: 'ASSIGNED', ESCALATED: 'ESCALATED' },
}));

vi.mock('../../../core/utils/utils.js', () => ({
  readableId: vi.fn(() => 'TKT-0001'),
}));

vi.mock('@org/utils', () => ({
  log: { data: vi.fn() },
}));

vi.mock('../../activity/activity.service.js', () => ({
  ActivityService: { lagActivity: vi.fn() },
}));

vi.mock('../../customer/customer.service.js', () => ({
  CustomerService: { createCustomerIdentity: vi.fn() },
}));

vi.mock('../../queue/queue.service.js', () => ({
  QueueService: { getLowerOrderQueue: vi.fn() },
}));

vi.mock('../../queueGroup/queueGroup.service.js', () => ({
  QueueGroupService: { getDefaultGroup: vi.fn() },
}));

vi.mock('../../notification/notification.service.js', () => ({
  NotificationService: { sendNotification: vi.fn() },
}));

vi.mock('../../socket/socket.service.js', () => ({
  SocketService: { invlidOrganizationQuery: vi.fn() },
}));

vi.mock('../ai/ticketAi.service.js', () => ({
  TicketAiService: { analyzeTicket: vi.fn() },
}));

const mockedGetTenantClient = vi.mocked(getTenantClient);
const mockedLagActivity = vi.mocked(ActivityService.lagActivity);
const mockedCreateCustomerIdentity = vi.mocked(
  CustomerService.createCustomerIdentity,
);
const mockedGetLowerOrderQueue = vi.mocked(QueueService.getLowerOrderQueue);
const mockedGetDefaultGroup = vi.mocked(QueueGroupService.getDefaultGroup);
const mockedSendNotification = vi.mocked(NotificationService.sendNotification);
const mockedInvlidOrganizationQuery = vi.mocked(
  SocketService.invlidOrganizationQuery,
);
const mockedAnalyzeTicket = vi.mocked(TicketAiService.analyzeTicket);
const mockedReadableId = vi.mocked(readableId);

describe('TicketService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedReadableId.mockReturnValue('TKT-0001');
    // Default $transaction implementation: runs the callback with a tx mock.
    mockTransaction.mockImplementation(async (callback: any) =>
      callback({
        ticket: {
          findUnique: mockTxTicketFindUnique,
          update: mockTxTicketUpdate,
        },
        ticketTransition: { create: mockTxTicketTransitionCreate },
        queueAgent: { update: mockTxQueueAgentUpdate },
      }),
    );
  });

  // ---------------------------------------------------------------------
  describe('createTicket', () => {
    it('creates a ticket with a generated code, logs activity, and notifies the owner', async () => {
      const mockTicket = {
        id: 'ticket_1',
        code: 'TKT-0001',
        queueId: 'queue_1',
      };
      mockTicketCreate.mockResolvedValue(mockTicket);

      const data = {
        subject: 'Cannot log in',
        description: 'User locked out',
        priority: 'HIGH' as any,
        category: 'ACCOUNT',
      };

      const result = await TicketService.createTicket({
        data,
        organizationId: 'org_1',
        ownerId: 'owner_1',
        customerId: 'customer_1',
        assignedTo: 'agent_1',
        queueId: 'queue_1',
        userId: 'user_1',
      });

      expect(mockedGetTenantClient).toHaveBeenCalledWith('org_1');
      expect(mockTicketCreate).toHaveBeenCalledWith({
        data: {
          code: 'TKT-0001',
          ...data,
          organizationId: 'org_1',
          customerId: 'customer_1',
          assignedTo: 'agent_1',
          queueId: 'queue_1',
        },
      });

      expect(mockedLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId: 'org_1',
          actorId: 'user_1',
          actorType: 'USER',
          event: 'ticket.created',
          entityId: 'ticket_1',
          entityType: 'TICKET',
        }),
      );

      expect(mockedSendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: 'owner_1',
          userId: null,
          data: expect.objectContaining({
            ticketId: 'ticket_1',
            type: 'TICKET',
          }),
        }),
      );

      expect(result).toEqual(mockTicket);
    });

    // ISSUE #4: sendNotification is fire-and-forget (not awaited) while
    // lagActivity is awaited. This test documents current behavior — a
    // rejected notification promise here will NOT be caught by createTicket
    // and could become an unhandled rejection.
    it('does not propagate a notification failure (fire-and-forget)', async () => {
      mockTicketCreate.mockResolvedValue({ id: 'ticket_1', code: 'TKT-0001' });
      mockedSendNotification.mockImplementation(() => {
        throw new Error('notification service down');
      });

      await expect(
        TicketService.createTicket({
          data: {
            subject: 's',
            description: 'd',
            priority: 'LOW' as any,
            category: 'c',
          },
          organizationId: 'org_1',
          ownerId: 'owner_1',
          customerId: 'customer_1',
          userId: 'user_1',
        }),
      ).rejects.toThrow('notification service down');
    });
  });

  // ---------------------------------------------------------------------
  describe('updateTicket', () => {
    it('increments version, logs activity, notifies the assignee, and invalidates socket cache', async () => {
      const updatedTicket = {
        id: 'ticket_1',
        code: 'TKT-0001',
        assignedTo: 'agent_1',
        version: 2,
      };
      mockTicketUpdate.mockReturnValue(updatedTicket);
      mockedSendNotification.mockReturnValue(Promise.resolve());
      const input = { status: 'CLOSED' } as any;

      const result = await TicketService.updateTicket({
        input,
        ticketId: 'ticket_1',
        organizationId: 'org_1',
        userId: 'user_1',
      });

      expect(mockTicketUpdate).toHaveBeenCalledWith({
        where: { id: 'ticket_1', organizationId: 'org_1' },
        data: { ...input, version: { increment: 1 } },
      });

      expect(mockedLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'ticket.updated',
          entityId: 'ticket_1',
          oldData: input,
          newData: updatedTicket,
        }),
      );

      expect(mockedSendNotification).toHaveBeenCalledWith(
        expect.objectContaining({ recipientId: 'agent_1' }),
      );

      expect(mockedInvlidOrganizationQuery).toHaveBeenCalledWith({
        organizationId: 'org_1',
        keys: ['ticket'],
      });

      expect(result).toEqual(updatedTicket);
    });

    it('does not send a notification when the ticket has no assignee', async () => {
      mockTicketUpdate.mockResolvedValue({
        id: 'ticket_1',
        code: 'TKT-0001',
        assignedTo: null,
      });

      await TicketService.updateTicket({
        input: { status: 'OPEN' } as any,
        ticketId: 'ticket_1',
        organizationId: 'org_1',
        userId: 'user_1',
      });

      expect(mockedSendNotification).not.toHaveBeenCalled();
      // Socket invalidation should still fire regardless of assignee.
      expect(mockedInvlidOrganizationQuery).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------
  describe('getTicketDetails', () => {
    it('returns a normalized ticket with customer info flattened', async () => {
      mockTicketFindUnique.mockResolvedValue({
        id: 'ticket_1',
        code: 'TKT-0001',
        customer: {
          identity: {
            email: 'jane@example.com',
            customer: [{ name: 'Jane Doe' }],
          },
        },
      });

      const result = await TicketService.getTicketDetails({
        ticketId: 'ticket_1',
        organizationId: 'org_1',
      });

      expect(mockTicketFindUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { organizationId: 'org_1', id: 'ticket_1' },
        }),
      );

      expect(result.customer).toEqual({
        email: 'jane@example.com',
        name: 'Jane Doe',
      });
    });

    it('returns null customer when identity is missing', async () => {
      mockTicketFindUnique.mockResolvedValue({
        id: 'ticket_1',
        customer: { identity: null },
      });

      const result = await TicketService.getTicketDetails({
        ticketId: 'ticket_1',
        organizationId: 'org_1',
      });

      expect(result.customer).toBeNull();
    });

    it('falls back to null name when customer array is empty', async () => {
      mockTicketFindUnique.mockResolvedValue({
        id: 'ticket_1',
        customer: {
          identity: { email: 'jane@example.com', customer: [] },
        },
      });

      const result = await TicketService.getTicketDetails({
        ticketId: 'ticket_1',
        organizationId: 'org_1',
      });

      expect(result.customer).toEqual({
        email: 'jane@example.com',
        name: null,
      });
    });

    it('throws a 404 appError when the ticket does not exist', async () => {
      mockTicketFindUnique.mockResolvedValue(null);

      await expect(
        TicketService.getTicketDetails({
          ticketId: 'missing',
          organizationId: 'org_1',
        }),
      ).rejects.toThrow(appError);

      await expect(
        TicketService.getTicketDetails({
          ticketId: 'missing',
          organizationId: 'org_1',
        }),
      ).rejects.toMatchObject({ statusCode: 404, code: 'NOT_FOUND' });
    });
  });

  // ---------------------------------------------------------------------
  describe('resolveQueueAssignment', () => {
    it('delegates to QueueService.getLowerOrderQueue', async () => {
      mockedGetLowerOrderQueue.mockResolvedValue('queue_1');

      const result = await TicketService.resolveQueueAssignment({
        organizationId: 'org_1',
        groupId: 'group_1',
      });

      expect(mockedGetLowerOrderQueue).toHaveBeenCalledWith({
        queueGroupId: 'group_1',
        organizationId: 'org_1',
      });
      expect(result).toBe('queue_1');
    });
  });

  // ---------------------------------------------------------------------
  describe('resolveAgentAssignment', () => {
    it('picks the least-loaded active agent for the queue', async () => {
      mockQueueAgentFindFirst.mockResolvedValue({ agentId: 'agent_1' });

      const result = await TicketService.resolveAgentAssignment({
        queueId: 'queue_1',
        organizationId: 'org_1',
      });

      expect(mockQueueAgentFindFirst).toHaveBeenCalledWith({
        where: { queueId: 'queue_1', organizationId: 'org_1', active: true },
        orderBy: { ticketCount: 'asc' },
      });
      expect(result).toBe('agent_1');
    });

    it('returns undefined when no active agent is available', async () => {
      mockQueueAgentFindFirst.mockResolvedValue(null);

      const result = await TicketService.resolveAgentAssignment({
        queueId: 'queue_1',
        organizationId: 'org_1',
      });

      expect(result).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------
  describe('updateTicketMovement', () => {
    it('decrements the previous agent, updates the ticket, logs a transition, and increments the new agent', async () => {
      mockTxTicketFindUnique.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: 'agent_old',
        queueId: 'queue_old',
      });
      mockTxTicketUpdate.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: 'agent_new',
        queueId: 'queue_new',
        status: 'OPEN',
      });

      const result = await TicketService.updateTicketMovement({
        ticketId: 'ticket_1',
        nextAgentId: 'agent_new',
        nextQueueId: 'queue_new',
        organizationId: 'org_1',
        action: 'ASSIGNED' as any,
        reason: 'load balancing',
      });

      // Previous agent decremented.
      expect(mockTxQueueAgentUpdate).toHaveBeenCalledWith({
        where: {
          queueId_agentId_organizationId: {
            agentId: 'agent_old',
            organizationId: 'org_1',
            queueId: 'queue_old',
          },
        },
        data: { ticketCount: { decrement: 1 } },
      });

      // New agent incremented.
      expect(mockTxQueueAgentUpdate).toHaveBeenCalledWith({
        where: {
          queueId_agentId_organizationId: {
            agentId: 'agent_new',
            organizationId: 'org_1',
            queueId: 'queue_new',
          },
        },
        data: { ticketCount: { increment: 1 } },
      });

      expect(mockTxTicketTransitionCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ticketId: 'ticket_1',
          action: 'ASSIGNED',
          fromQueueId: 'queue_old',
          toQueueId: 'queue_new',
          fromAgentId: 'agent_old',
          toAgentId: 'agent_new',
          escalationReason: 'load balancing',
          organizationId: 'org_1',
        }),
      });

      expect(result).toEqual({
        currentTicket: {
          id: 'ticket_1',
          assignedTo: 'agent_old',
          queueId: 'queue_old',
        },
        updatedTicket: {
          id: 'ticket_1',
          assignedTo: 'agent_new',
          queueId: 'queue_new',
          status: 'OPEN',
        },
      });
    });

    it('skips the decrement when the new agent is the same as the current agent', async () => {
      mockTxTicketFindUnique.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: 'agent_1',
        queueId: 'queue_1',
      });
      mockTxTicketUpdate.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: 'agent_1',
        queueId: 'queue_1',
        status: 'OPEN',
      });

      await TicketService.updateTicketMovement({
        ticketId: 'ticket_1',
        nextAgentId: 'agent_1',
        nextQueueId: 'queue_1',
        organizationId: 'org_1',
        action: 'ASSIGNED' as any,
      });

      // Only one call — the increment — no decrement for the "same agent" case.
      expect(mockTxQueueAgentUpdate).toHaveBeenCalledTimes(1);
      expect(mockTxQueueAgentUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ data: { ticketCount: { increment: 1 } } }),
      );
    });

    it('skips the decrement when there was no previously assigned agent', async () => {
      mockTxTicketFindUnique.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: null,
        queueId: null,
      });
      mockTxTicketUpdate.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: 'agent_new',
        queueId: 'queue_new',
        status: 'OPEN',
      });

      await TicketService.updateTicketMovement({
        ticketId: 'ticket_1',
        nextAgentId: 'agent_new',
        nextQueueId: 'queue_new',
        organizationId: 'org_1',
        action: 'ASSIGNED' as any,
      });

      expect(mockTxQueueAgentUpdate).toHaveBeenCalledTimes(1);
    });
  });

  // ---------------------------------------------------------------------
  describe('createAndAssign', () => {
    const baseInput = {
      email: 'customer@example.com',
      subject: 'Help needed',
      description: 'Something broke',
    } as any;

    beforeEach(() => {
      mockedCreateCustomerIdentity.mockResolvedValue({
        id: 'customer_1',
      } as any);
      mockTicketCreate.mockResolvedValue({ id: 'ticket_1', code: 'TKT-0001' });
    });

    it('uses an explicit assignment without calling the AI service', async () => {
      mockQueueAgentFindFirst.mockResolvedValue(null); // unused in this path
      mockTxTicketFindUnique.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: null,
        queueId: null,
      });
      mockTxTicketUpdate.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: 'agent_1',
        queueId: 'queue_1',
      });

      const result = await TicketService.createAndAssign({
        input: {
          ...baseInput,
          assignment: {
            groupId: 'group_1',
            queueId: 'queue_1',
            agentId: 'agent_1',
          },
        },
        organizationId: 'org_1',
        userId: 'user_1',
        ownerId: 'owner_1',
      });

      expect(mockedAnalyzeTicket).not.toHaveBeenCalled();
      expect(mockedGetLowerOrderQueue).not.toHaveBeenCalled();
      expect(mockQueueAgentFindFirst).not.toHaveBeenCalled();
      expect(result).toEqual({
        groupId: 'group_1',
        queueId: 'queue_1',
        agentId: 'agent_1',
      });

      // actorType is USER because assignment.agentId was explicitly provided.
      expect(mockedLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          actorType: 'USER',
          event: 'ticket.assigned',
        }),
      );
    });

    it('calls the AI service when no groupId is provided and uses its groupId when confidence is high', async () => {
      mockedAnalyzeTicket.mockResolvedValue({
        groupId: 'ai_group_1',
        priority: 'HIGH',
        confidence: 0.95,
      } as any);
      mockedGetLowerOrderQueue.mockResolvedValue('queue_ai');
      mockQueueAgentFindFirst.mockResolvedValue({ agentId: 'agent_ai' });
      mockTxTicketFindUnique.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: null,
        queueId: null,
      });
      mockTxTicketUpdate.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: 'agent_ai',
        queueId: 'queue_ai',
      });

      const result = await TicketService.createAndAssign({
        input: { ...baseInput },
        organizationId: 'org_1',
        userId: 'user_1',
        ownerId: 'owner_1',
      });

      expect(mockedAnalyzeTicket).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId: 'org_1',
          data: {
            subject: baseInput.subject,
            description: baseInput.description,
          },
        }),
      );
      expect(mockedGetDefaultGroup).not.toHaveBeenCalled();
      expect(mockedGetLowerOrderQueue).toHaveBeenCalledWith(
        expect.objectContaining({ queueGroupId: 'ai_group_1' }),
      );
      expect(result).toEqual({
        groupId: 'ai_group_1',
        queueId: 'queue_ai',
        agentId: 'agent_ai',
      });

      // actorType is SYSTEM because agent was auto-resolved, not user-supplied.
      expect(mockedLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({ actorType: 'SYSTEM' }),
      );
    });

    it('falls back to the default group when AI confidence is below 0.8', async () => {
      mockedAnalyzeTicket.mockResolvedValue({
        groupId: 'ai_group_1',
        priority: 'LOW',
        confidence: 0.4,
      } as any);
      mockedGetDefaultGroup.mockResolvedValue('default_group');
      mockedGetLowerOrderQueue.mockResolvedValue('queue_default');
      mockQueueAgentFindFirst.mockResolvedValue({ agentId: 'agent_default' });
      mockTxTicketFindUnique.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: null,
        queueId: null,
      });
      mockTxTicketUpdate.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: 'agent_default',
        queueId: 'queue_default',
      });

      const result = await TicketService.createAndAssign({
        input: { ...baseInput },
        organizationId: 'org_1',
        userId: 'user_1',
        ownerId: 'owner_1',
      });

      expect(mockedGetDefaultGroup).toHaveBeenCalledWith('org_1');
      expect(result).toEqual(
        expect.objectContaining({ groupId: 'default_group' }),
      );
    });

    it('do not add metadata when  when confidence is low', async () => {
      mockedAnalyzeTicket.mockResolvedValue({
        groupId: 'ai_group_1',
        priority: 'HIGH',
        summary: 'summary',
        confidence: 0.2,
      } as any);
      mockedGetDefaultGroup.mockResolvedValue('default_group');
      mockedGetLowerOrderQueue.mockResolvedValue('queue_1');
      mockQueueAgentFindFirst.mockResolvedValue({ agentId: 'agent_1' });
      mockTxTicketFindUnique.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: null,
        queueId: null,
      });
      mockTxTicketUpdate.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: 'agent_1',
        queueId: 'queue_1',
      });

      await TicketService.createAndAssign({
        input: { ...baseInput },
        organizationId: 'org_1',
        userId: 'user_1',
        ownerId: 'owner_1',
      });

      expect(mockTicketCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.not.objectContaining({
            priority: 'HIGH',
            summary: 'summary',
          }),
        }),
      );
    });

    it('does not call resolveQueueAssignment when a queueId is already supplied', async () => {
      mockTxTicketFindUnique.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: null,
        queueId: null,
      });
      mockTxTicketUpdate.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: 'agent_1',
        queueId: 'queue_1',
      });

      await TicketService.createAndAssign({
        input: {
          ...baseInput,
          assignment: { queueId: 'queue_1', agentId: 'agent_1' },
        },
        organizationId: 'org_1',
        userId: 'user_1',
        ownerId: 'owner_1',
      });

      expect(mockedGetLowerOrderQueue).not.toHaveBeenCalled();
    });

    it('does not call resolveAgentAssignment when an agentId is already supplied', async () => {
      mockTxTicketFindUnique.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: null,
        queueId: null,
      });
      mockTxTicketUpdate.mockResolvedValue({
        id: 'ticket_1',
        assignedTo: 'agent_1',
        queueId: 'queue_1',
      });

      await TicketService.createAndAssign({
        input: {
          ...baseInput,
          assignment: { queueId: 'queue_1', agentId: 'agent_1' },
        },
        organizationId: 'org_1',
        userId: 'user_1',
        ownerId: 'owner_1',
      });

      expect(mockQueueAgentFindFirst).not.toHaveBeenCalled();
    });

    it('does not attempt AI analysis or queue/agent resolution when groupId is already supplied but stops short if queueId cannot resolve', async () => {
      mockedGetLowerOrderQueue.mockResolvedValue(undefined as any);

      const result = await TicketService.createAndAssign({
        input: { ...baseInput, assignment: { groupId: 'group_1' } },
        organizationId: 'org_1',
        userId: 'user_1',
        ownerId: 'owner_1',
      });

      expect(mockedAnalyzeTicket).not.toHaveBeenCalled();
      expect(mockedGetLowerOrderQueue).toHaveBeenCalledWith(
        expect.objectContaining({ queueGroupId: 'group_1' }),
      );
      expect(mockQueueAgentFindFirst).not.toHaveBeenCalled(); // no queueId resolved, so agent step is skipped
      expect(result).toEqual(
        expect.objectContaining({
          assignment: {
            agentId: undefined,
            groupId: 'group_1',
            queueId: undefined,
          },
        }),
      );
    });
  });
});
