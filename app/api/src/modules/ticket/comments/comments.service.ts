import { getTenantClient } from '@org/database';
import { ActivityService } from '../../activity/activity.service';
import { NotificationService } from '../../notification/notification.service';
import { SocketService } from '../../socket/socket.service';
import { ParsedQs } from 'qs';
import { APIFeatures } from '../../../core/utils/apiFeatures';

export class TicketCommentsService {
  static createTicketComment = async ({
    organizationId,
    ticketId,
    userId,
    comment,
    id,
    isInternal,
  }: {
    ticketId: string;
    id?: string;
    userId: string;
    comment: string;
    isInternal?: boolean;
    organizationId: string;
  }) => {
    const tenantDb = getTenantClient(organizationId);
    const data = await tenantDb.ticketComment.create({
      data: {
        id,
        authorId: userId,
        ticketId,
        comment,
        isInternal,
        organizationId,
      },
      include: {
        ticket: {
          select: {
            assignedTo: true,
          },
        },
      },
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: 'USER',
      message: 'user added comment in ticket ',
      event: 'ticket.comment.created',
      entityId: data.id,
      entityType: 'TICKET',
    });
    if (data.ticket.assignedTo)
      NotificationService.sendNotification({
        recipientId: data.ticket.assignedTo,
        userId,
        data: {
          organizationId,
          channel: 'IN_APP',
          title: 'New Comment added',
          message: `Ticket comment added`,
          type: 'TICKET',
          actorId: userId,
          ticketId: data.ticketId,
        },
      });

    SocketService.invlidOrganizationQuery({
      organizationId,
      keys: ['ticket', 'comment'],
    });
    return data;
  };
  static getTicketComments = async ({
    ticketId,
    organizationId,
    queryString,
  }: {
    ticketId: string;
    organizationId: string;
    queryString: ParsedQs;
  }) => {
    const tenantDb = getTenantClient(organizationId);
    const { offset, limit } = new APIFeatures(queryString).pagination();
    const comments = await tenantDb.ticketComment.findMany({
      where: {
        ticketId,
        organizationId,
      },
      select: {
        comment: true,
        createdAt: true,
        id: true,
        author: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: offset,
    });
    const total = await tenantDb.ticketComment.count({
      where: {
        ticketId,
        organizationId,
      },
    });
    const pagination = {
      offset,
      limit,
      total,
    };
    return { comments, pagination };
  };
}
