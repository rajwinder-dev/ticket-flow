import {
  getTenantClient,
  priority,
  Priority,
  TicketStatus,
} from '@org/database';
import { ParsedQs } from 'qs';
import { APIFeatures } from '../../../core/utils/apiFeatures';
import { allowedTransitions } from '@org/constants';
import { appError } from '../../../core/utils/appError';
import { ActivityService } from '../../activity/activity.service';
import { NotificationService } from '../../notification/notification.service';
import { SocketService } from '../../socket/socket.service';
import { TicketService } from '../ticket/ticket.service';
import { TicketCommentsService } from '../comments/comments.service';

export class TicketTransitionService {
  static updateStatus = async ({
    ticketId,
    organizationId,
    nextStatus,
    version,
    userId,
  }: {
    ticketId: string;
    organizationId: string;
    nextStatus: TicketStatus;
    version: number;
    userId: string;
  }) => {
    const tanentDb = getTenantClient(organizationId);

    const currentData = await tanentDb.ticket.findUnique({
      where: { id: ticketId },
      select: {
        status: true,
        queueId: true,
        assignedTo: true,
      },
    });
    if (!currentData) throw new appError('Ticket not found', 404);
    const allowedStatus = allowedTransitions[currentData.status];
    if (!allowedStatus?.includes(nextStatus)) {
      throw new appError('Invalid transition', 403);
    }

    const ticket = await tanentDb.$transaction(async (tx) => {
      // update ticket status
      const updatedTicket = await tx.ticket.updateManyAndReturn({
        where: {
          id: ticketId,
          organizationId,
          version,
        },
        data: {
          status: nextStatus,
          version: {
            increment: 1,
          },
        },
      });

      if (updatedTicket.length === 0) {
        const existTicket = await tx.ticket.findUnique({
          where: { id: ticketId },
          select: { version: true },
        });
        if (existTicket)
          throw new appError(
            'Ticket already updated , refresh again',
            409,
            'VERSION_MISSMATCH',
            {
              currenVersion: existTicket.version,
            },
          );
      }

      const { queueId, assignedTo } = currentData;

      if (nextStatus === 'CLOSED' && queueId && assignedTo) {
        await tx.queueAgent.update({
          where: {
            queueId_agentId_organizationId: {
              organizationId,
              agentId: assignedTo,
              queueId,
            },
          },
          data: {
            ticketCount: {
              decrement: 1,
            },
          },
        });
      }
      if (nextStatus === 'REOPENED' && queueId && assignedTo) {
        await tx.queueAgent.update({
          where: {
            queueId_agentId_organizationId: {
              organizationId,
              agentId: assignedTo,
              queueId,
            },
          },
          data: {
            ticketCount: {
              increment: 1,
            },
          },
        });
      }
      await tx.ticketTransition.create({
        data: {
          ticketId,
          action: 'STATUS_CHANGED',
          fromStatus: currentData?.status,
          toStatus: nextStatus,
          organizationId,
        },
      });
      return { ...updatedTicket[0] };
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: 'USER',
      message: 'ticket status updated ',
      event: 'ticket.update',
      entityId: ticketId,
      entityType: 'TICKET',
      oldData: { status: currentData.status },
      newData: { status: nextStatus },
    });
    if (currentData?.assignedTo)
      NotificationService.sendNotification({
        recipientId: currentData.assignedTo,
        userId,
        data: {
          channel: 'IN_APP',
          title: 'Ticket status updated',
          message: `Ticket status updated to ${nextStatus}`,
          type: 'SYSTEM',
          metadata: { test: 'test' },
          expiresAt: new Date(),
          organizationId,
          ticketId,
          actorId: userId,
        },
      });
    SocketService.invlidOrganizationQuery({ organizationId, keys: ['ticket'] });
    return ticket;
  };
  static updatePriority = async ({
    ticketId,
    organizationId,
    priority,
    version,
    userId,
  }: {
    ticketId: string;
    organizationId: string;
    priority: Priority;
    version: number;
    userId: string;
  }) => {
    const tanentDb = getTenantClient(organizationId);
    const { updatedTicket, currentTicket } = await tanentDb.$transaction(
      async (tx) => {
        const currentTicket = await tx.ticket.findUnique({
          where: { id: ticketId },
          select: { priority: true, assignedTo: true },
        });
        const updatedTicket = await tx.ticket.updateManyAndReturn({
          where: {
            id: ticketId,
            organizationId,
            version,
          },
          data: {
            priority,
            version: {
              increment: 1,
            },
          },
        });
        if (updatedTicket.length === 0) {
          const existTicket = await tx.ticket.findUnique({
            where: { id: ticketId },
            select: { version: true },
          });
          if (existTicket)
            throw new appError(
              'Ticket already updated , refersh',
              409,
              'VERSION_MISSMATCH',
              {
                currenVersion: existTicket.version,
              },
            );
        }
        await tx.ticketTransition.create({
          data: {
            ticketId,
            action: 'PRIORITY_CHANGED',
            toPriority: priority,
            fromPriority: currentTicket?.priority,
            organizationId,
          },
        });
        return { updatedTicket: updatedTicket[0], currentTicket };
      },
    );
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: 'USER',
      message: 'ticket priority changed ',
      event: 'ticket.update',
      entityId: ticketId,
      entityType: 'TICKET',
      oldData: { priority: currentTicket?.priority },
      newData: { priority: priority },
    });
    if (currentTicket?.assignedTo)
      NotificationService.sendNotification({
        recipientId: currentTicket.assignedTo,
        userId,
        data: {
          channel: 'IN_APP',
          title: 'Ticket status updated',
          message: `Ticket Priority updated to ${priority}`,
          type: 'SYSTEM',
          metadata: { test: 'test' },
          expiresAt: new Date(),
        },
      });

    SocketService.invlidOrganizationQuery({ organizationId, keys: ['ticket'] });
    return updatedTicket;
  };
  static escalateTicket = async ({
    ticketId,
    organizationId,
    userId,
    input,
  }: {
    input: {
      priority: priority;
      reason: string;
      comment: string;
      groupId?: string;
    };
    ticketId: string;
    organizationId: string;
    userId: string;
  }) => {
    const tenantDb = getTenantClient(organizationId);
    const currentTicket = await tenantDb.ticket.findUnique({
      where: { id: ticketId },
    });
    let { currentQueue, nextQueue } = await this.escalationOptions({
      organizationId,
      ticketId,
      groupId: input.groupId,
    });

    if (!currentQueue) throw new appError('Ticket not found', 404, 'NOT_FOUND');
    if (!input.groupId && !nextQueue) {
      throw new appError('You need to select a group', 400, 'INVALID_PAYLOAD');
    }

    if (!nextQueue)
      throw new appError(
        'No further queue. Please select another group.',
        409,
        'CONFLICT_ERROR',
      );

    // try to get agent
    const agentId = await TicketService.resolveAgentAssignment({
      queueId: nextQueue.id,
      organizationId,
    });
    if (!agentId) throw new appError('No Agent found.', 409, 'CONFLICT_ERROR');

    const { updatedTicket } = await TicketService.updateTicketMovement({
      ticketId,
      nextQueueId: nextQueue.id,
      nextAgentId: agentId,
      organizationId,
      action: 'ESCALATED',
      priority: input.priority,
      reason: input.reason,
    });
    await TicketCommentsService.createTicketComment({
      ticketId,
      organizationId,
      userId,
      comment: input.comment,
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: userId ? 'USER' : 'SYSTEM',
      message: 'ticket escalated ',
      event: 'ticket.agent.escalated',
      entityId: ticketId,
      entityType: 'TICKET',

      oldData: currentTicket,
      newData: updatedTicket,
    });

    if (updatedTicket.assignedTo)
      NotificationService.sendNotification({
        recipientId: updatedTicket.assignedTo,
        userId,
        data: {
          organizationId,
          channel: 'IN_APP',
          title: ' Ticket Escalated',
          message: `Ticket ${updatedTicket.code} has been escalated.`,
          type: 'TICKET',
          actorId: userId,
          ticketId: updatedTicket.id,
        },
      });

    // update ticket count for new Agent
    return updatedTicket;
  };
  static assignTicket = async ({
    ticketId,
    organizationId,
    assignId,
    targetType,
    userId,
  }: {
    ticketId: string;
    organizationId: string;
    assignId: string;
    targetType: 'AGENT' | 'QUEUE';
    userId: string;
  }) => {
    // thie AssginedId can be agentId or queueId
    const tenantDb = getTenantClient(organizationId);
    let queueId: string | undefined;
    let agentId: string | undefined;
    switch (targetType) {
      case 'QUEUE':
        // assignID = provided queueId
        {
          queueId = assignId;
          agentId = await TicketService.resolveAgentAssignment({
            queueId,
            organizationId,
          });
        }
        break;
      case 'AGENT':
        // assignID = provided agentId
        {
          const queueData = await tenantDb.queueAgent.findFirst({
            where: {
              agentId,
              organizationId,
              active: true,
            },
            select: { queueId: true, agentId: true },
          });
          queueId = queueData?.queueId;
          agentId = queueData?.agentId;
        }
        if (queueId === assignId)
          throw new appError(
            'Already assigned to agent ',
            409,
            'CONFLICT_ERROR',
          );

        break;
      default:
        throw new appError('Invalid targetType ', 400);
    }
    if (!queueId) throw new appError('Queue not found ', 404, 'NOT_FOUND');
    if (!agentId)
      throw new appError('Agent not found in queue', 404, 'NOT_FOUND');
    const { updatedTicket, currentTicket } =
      await TicketService.updateTicketMovement({
        ticketId,
        organizationId,
        nextAgentId: agentId,
        nextQueueId: queueId,
        action: 'ASSIGNED',
      });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: 'USER',
      message: 'ticket assignment updated ',
      event: 'ticket.agent.assigned',
      entityId: ticketId,
      entityType: 'TICKET',
      oldData: currentTicket,
      newData: updatedTicket,
    });
    return updatedTicket;
  };
  static escalationOptions = async ({
    organizationId,
    ticketId,
    groupId,
  }: {
    organizationId: string;
    ticketId: string;
    groupId?: string;
  }) => {
    let groupIdRequired = false;
    let nextQueue: { id: string; name: string } | null = null;
    const tenantDb = getTenantClient(organizationId);
    const queueData = await tenantDb.ticket.findUnique({
      where: {
        id: ticketId,
        organizationId,
        active: true,
      },
      select: {
        queue: {
          select: {
            id: true,
            name: true,
            queueGroupId: true,
            order: true,
          },
        },
      },
    });

    if (!queueData?.queue) {
      return { currentQueue: null, nextQueue: null };
    }

    if (queueData.queue.order !== null) {
      const findNextQueue = await tenantDb.queue.findFirst({
        where: {
          organizationId,
          queueGroupId: queueData.queue.queueGroupId,
          order: { gt: queueData.queue.order },
          active: true,
        },
        select: {
          id: true,
          name: true,
          order: true,
        },
        orderBy: { order: 'asc' },
      });
      if (!findNextQueue) groupIdRequired = true;
      nextQueue = findNextQueue;
    }
    if (groupId) {
      nextQueue = await tenantDb.queue.findFirst({
        where: {
          organizationId,
          queueGroupId: groupId,
          order: { gt: 0 },
          active: true,
        },
        select: {
          id: true,
          name: true,
          order: true,
        },
        orderBy: { order: 'asc' },
      });
    }
    return {
      groupIdRequired,
      currentQueue: {
        id: queueData.queue.id,
        name: queueData.queue.name,
        order: queueData.queue.order,
      },
      nextQueue,
    };
  };

  static getTicketTransitionHistory = async ({
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
    const total = await tenantDb.ticketTransition.count({
      where: {
        organizationId,
        ticketId,
      },
    });
    const data = await tenantDb.ticketTransition.findMany({
      where: {
        organizationId,
        ticketId,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        action: true,
        fromPriority: true,
        toPriority: true,
        fromStatus: true,
        toStatus: true,
        escalationReason: true,
        createdAt: true,
        note: true,
        fromQueue: {
          select: {
            name: true,
          },
        },
        toQueue: {
          select: {
            name: true,
          },
        },
        fromAgent: {
          select: {
            name: true,
          },
        },
        toAgent: {
          select: {
            name: true,
          },
        },
        fromGroup: {
          select: {
            name: true,
          },
        },
        toGroup: {
          select: {
            name: true,
          },
        },
        changedBy: {
          select: {
            name: true,
          },
        },
      },
    });
    const pagination = {
      offset,
      limit,
      total,
    };
    return { data, pagination };
  };
}
