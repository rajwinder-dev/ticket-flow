import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTenantClient } from '@org/database';
import { ActivityService } from '../../activity/activity.service';
import { NotificationService } from '../../notification/notification.service';
import { SocketService } from '../../socket/socket.service';
import { TicketCommentsService } from './comments.service';

const { mockCreate, mockFindMany, mockCount } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock('@org/database', () => ({
  getTenantClient: vi.fn(() => ({
    ticketComment: {
      create: mockCreate,
      findMany: mockFindMany,
      count: mockCount,
    },
  })),
}));

vi.mock('../../activity/activity.service', () => ({
  ActivityService: {
    lagActivity: vi.fn(),
  },
}));

vi.mock('../../notification/notification.service', () => ({
  NotificationService: {
    sendNotification: vi.fn(),
  },
}));

vi.mock('../../socket/socket.service', () => ({
  SocketService: {
    invlidOrganizationQuery: vi.fn(),
  },
}));

const mockedGetTenantClient = vi.mocked(getTenantClient);
const mockedLagActivity = vi.mocked(ActivityService.lagActivity);
const mockedSendNotification = vi.mocked(NotificationService.sendNotification);
const mockedInvlidOrganizationQuery = vi.mocked(
  SocketService.invlidOrganizationQuery,
);

describe('TicketCommentsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTicketComment', () => {
    it('creates a comment, logs activity, notifies assignee, and invalidates socket query', async () => {
      const mockData = {
        id: 'comment_1',
        ticketId: 'ticket_1',
        comment: 'Hello',
        ticket: { assignedTo: 'user_2' },
      };
      mockCreate.mockResolvedValue(mockData);

      const result = await TicketCommentsService.createTicketComment({
        organizationId: 'org_1',
        ticketId: 'ticket_1',
        userId: 'user_1',
        comment: 'Hello',
        isInternal: false,
      });

      expect(mockedGetTenantClient).toHaveBeenCalledWith('org_1');
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          id: undefined,
          authorId: 'user_1',
          ticketId: 'ticket_1',
          comment: 'Hello',
          isInternal: false,
          organizationId: 'org_1',
        },
        include: {
          ticket: { select: { assignedTo: true } },
        },
      });

      expect(mockedLagActivity).toHaveBeenCalledWith({
        organizationId: 'org_1',
        actorId: 'user_1',
        actorType: 'USER',
        message: 'user added comment in ticket ',
        event: 'ticket.comment.created',
        entityId: 'comment_1',
        entityType: 'TICKET',
      });

      expect(mockedSendNotification).toHaveBeenCalledWith({
        recipientId: 'user_2',
        userId: 'user_1',
        data: {
          organizationId: 'org_1',
          channel: 'IN_APP',
          title: 'New Comment added',
          message: 'Ticket comment added',
          type: 'TICKET',
          actorId: 'user_1',
          ticketId: 'ticket_1',
        },
      });

      expect(mockedInvlidOrganizationQuery).toHaveBeenCalledWith({
        organizationId: 'org_1',
        keys: ['ticket', 'comment'],
      });

      expect(result).toEqual(mockData);
    });

    it('does not send a notification when ticket has no assignee', async () => {
      const mockData = {
        id: 'comment_2',
        ticketId: 'ticket_1',
        comment: 'No assignee here',
        ticket: { assignedTo: null },
      };
      mockCreate.mockResolvedValue(mockData);

      await TicketCommentsService.createTicketComment({
        organizationId: 'org_1',
        ticketId: 'ticket_1',
        userId: 'user_1',
        comment: 'No assignee here',
      });

      expect(mockedSendNotification).not.toHaveBeenCalled();
      expect(mockedInvlidOrganizationQuery).toHaveBeenCalled();
    });
  });

  describe('getTicketComments', () => {
    it('returns paginated comments and total count using default pagination', async () => {
      const mockComments = [
        {
          id: 'comment_1',
          comment: 'Hi',
          createdAt: new Date('2024-01-01'),
          author: { name: 'Jane', email: 'jane@example.com' },
        },
      ];
      mockFindMany.mockResolvedValue(mockComments);
      mockCount.mockResolvedValue(1);

      const result = await TicketCommentsService.getTicketComments({
        ticketId: 'ticket_1',
        organizationId: 'org_1',
        queryString: {},
      });

      expect(mockedGetTenantClient).toHaveBeenCalledWith('org_1');

      expect(mockFindMany).toHaveBeenCalledWith({
        where: { ticketId: 'ticket_1', organizationId: 'org_1' },
        select: {
          comment: true,
          createdAt: true,
          id: true,
          author: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'asc' },
        take: 10,
        skip: 0,
      });

      expect(mockCount).toHaveBeenCalledWith({
        where: { ticketId: 'ticket_1', organizationId: 'org_1' },
      });

      expect(result).toEqual({
        comments: mockComments,
        pagination: { offset: 0, limit: 10, total: 1 },
      });
    });
  });
});
