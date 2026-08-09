import { CreateTicketInput } from '@org/zod';
import { appError } from '../../../core/utils/appError.js';
import {
  getTenantClient,
  Priority,
  priority,
  Prisma,
  Sentiment,
  TicketAction,
} from '@org/database';
import { readableId } from '../../../core/utils/utils.js';
import { ActivityService } from '../../activity/activity.service.js';
import { CustomerService } from '../../customer/customer.service.js';
import { QueueService } from '../../queue/queue.service.js';
import { QueueGroupService } from '../../queueGroup/queueGroup.service.js';
import { NotificationService } from '../../notification/notification.service.js';
import { SocketService } from '../../socket/socket.service.js';
import { TicketAiService } from '../ai/ticketAi.service.js';

export class TicketService {
  static createAndAssign = async ({
    input,
    organizationId,
    userId,
    ownerId,
  }: {
    input: CreateTicketInput;
    organizationId: string;
    ownerId: string;
    userId?: string;
  }) => {
    let { email, assignment, ...data } = input;
    let groupId = assignment?.groupId;
    let queueId = assignment?.queueId;
    let agentId = assignment?.agentId;

    const customerData = await CustomerService.createCustomerIdentity(
      email,
      organizationId,
    );

    if (!groupId) {
      // ai get response
      const aiResponse = await TicketAiService.analyzeTicket({
        organizationId,
        data: {
          subject: data.subject,
          description: data.description,
        },
      });
      // if ai get response
      if (aiResponse) {
        const { groupId: aiGroupId, ...rest } = aiResponse;
        if (aiResponse.confidence < 0.8) {
          groupId = await QueueGroupService.getDefaultGroup(organizationId);
        } else {
          data = { ...data, ...rest };
          groupId = aiGroupId;
        }
      }
    }
    if (!queueId && groupId) {
      queueId = await this.resolveQueueAssignment({
        organizationId,
        groupId,
      });
    }
    if (!agentId && queueId) {
      agentId = await this.resolveAgentAssignment({
        organizationId,
        queueId,
      });
    }
    const finalAssignment = {
      groupId,
      queueId,
      agentId,
    };
    const ticket = await this.createTicket({
      data,
      assignedTo: finalAssignment.agentId,
      organizationId,
      customerId: customerData.id,
      queueId: finalAssignment.queueId,
      userId,
      ownerId,
    });

    if (agentId && queueId) {
      await this.updateTicketMovement({
        ticketId: ticket.id,
        nextAgentId: agentId,
        nextQueueId: queueId,
        organizationId,
        action: 'ASSIGNED',
      });
      await ActivityService.lagActivity({
        organizationId,
        actorId: userId,
        actorType: assignment?.agentId ? 'USER' : 'SYSTEM',
        message: 'ticket escalated ',
        event: 'ticket.assigned',
        entityId: ticket.id,
        entityType: 'TICKET',
      });
      await NotificationService.sendNotification({
        recipientId: agentId,
        userId: null,
        data: {
          organizationId,
          channel: 'IN_APP',
          title: 'New Ticket assigned',
          message: `Ticket ${ticket.code} has been assigned to you`,
          type: 'TICKET',
          actorId: userId,
          ticketId: ticket.id,
        },
      });
      SocketService.invlidOrganizationQuery({
        organizationId,
        keys: ['ticket'],
      });
      return finalAssignment;
    }
    return { ticket, assignment: finalAssignment };
  };
  static createTicket = async ({
    data,
    organizationId,
    ownerId,
    customerId,
    assignedTo,
    queueId,
    userId,
  }: {
    data: {
      subject: string;
      description: string;
      priority: priority;
      category: string;
      sentiment?: Sentiment;
      keywords?: string[];
      confidence?: number;
      summary?: string;
    };
    organizationId: string;
    customerId: string;
    assignedTo?: string;
    queueId?: string;
    userId?: string;
    ownerId: string;
  }) => {
    const tenantDb = getTenantClient(organizationId);
    const ticket = await tenantDb.ticket.create({
      data: {
        code: readableId('TKT'),
        ...data,
        organizationId,
        customerId,
        assignedTo,
        queueId,
      },
    });
    await NotificationService.sendNotification({
      recipientId: ownerId,
      userId: null,
      data: {
        organizationId,
        channel: 'IN_APP',
        title: 'New Ticket created and assigned',
        message: `Ticket ${ticket.code} has been created.`,
        type: 'TICKET',
        actorId: userId,
        ticketId: ticket.id,
      },
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: 'USER',
      message: 'new ticket is created',
      event: 'ticket.created',
      entityId: ticket.id,
      entityType: 'TICKET',
    });
    return ticket;
  };
  static updateTicket = async ({
    input,
    ticketId,
    organizationId,
    userId,
  }: {
    input: Prisma.TicketUpdateInput;
    ticketId: string;
    organizationId: string;
    userId: string;
  }) => {
    const tenantDb = getTenantClient(organizationId);
    const updatedTicket = await tenantDb.ticket.update({
      where: { id: ticketId, organizationId },
      data: {
        ...input,
        version: {
          increment: 1,
        },
      },
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: 'USER',
      message: 'ticket updated is created',
      event: 'ticket.updated',
      entityId: ticketId,
      entityType: 'TICKET',
      oldData: input,
      newData: updatedTicket,
    });
    if (updatedTicket.assignedTo)
      await NotificationService.sendNotification({
        recipientId: updatedTicket.assignedTo,
        userId,
        data: {
          organizationId,
          channel: 'IN_APP',
          title: 'New Ticket created and assigned',
          message: `Ticket ${updatedTicket.code} has been updated.`,
          type: 'TICKET',
          actorId: userId,
          ticketId: updatedTicket.id,
        },
      });
    SocketService.invlidOrganizationQuery({ organizationId, keys: ['ticket'] });
    return updatedTicket;
  };
  static getTicketDetails = async ({
    ticketId,
    organizationId,
  }: {
    ticketId: string;
    organizationId: string;
  }) => {
    const tenantDb = getTenantClient(organizationId);
    const data = await tenantDb.ticket.findUnique({
      where: {
        organizationId,
        id: ticketId,
      },
      select: {
        id: true,
        code: true,
        subject: true,
        description: true,
        status: true,
        priority: true,
        category: true,
        createdAt: true,
        sentiment: true,
        keywords: true,
        summary: true,
        confidence: true,
        updatedAt: true,
        version: true,
        assignedToUser: {
          select: {
            email: true,
            name: true,
          },
        },
        customer: {
          select: {
            identity: {
              select: {
                email: true,
                customer: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },

        queue: {
          select: {
            name: true,
            order: true,
          },
        },
      },
    });
    if (!data) throw new appError('Ticket not found ', 404, 'NOT_FOUND');

    const normalized = {
      ...data,
      customer: data?.customer?.identity
        ? {
            email: data.customer.identity.email,
            name: data.customer.identity.customer?.[0]?.name ?? null,
          }
        : null,
    };

    return normalized;
  };
  static resolveQueueAssignment = async ({
    organizationId,
    groupId,
  }: {
    organizationId: string;
    groupId: string;
  }) => {
    const queueId = await QueueService.getLowerOrderQueue({
      queueGroupId: groupId,
      organizationId,
    });
    return queueId;
  };
  static resolveAgentAssignment = async ({
    queueId,
    organizationId,
  }: {
    queueId: string;
    organizationId: string;
  }) => {
    const tenantDb = getTenantClient(organizationId);
    // * load balance strategy
    const agent = await tenantDb.queueAgent.findFirst({
      where: {
        queueId,
        organizationId,
        active: true,
      },

      orderBy: {
        ticketCount: 'asc',
      },
    });
    return agent?.agentId;
  };
  static updateTicketMovement = async ({
    ticketId,
    nextAgentId,
    nextQueueId,
    organizationId,
    action,
    reason,
    priority
  }: {
    ticketId: string;
    nextAgentId: string;
    nextQueueId: string;
    organizationId: string;
    action: TicketAction;
    reason?: string;
    priority?: Priority
  }) => {
    const tenantDb = getTenantClient(organizationId);
    const ticketData = await tenantDb.$transaction(async (tx) => {
      const currentTicket = await tx.ticket.findUnique({
        where: { id: ticketId },
      });
      // ! ts ignore undefined case
      //  todo: if queue id not in ticket then find
      // decrement previous agent (only if different)
      if (
        currentTicket?.assignedTo &&
        currentTicket.assignedTo !== nextAgentId &&
        currentTicket.queueId
      ) {
        await tx.queueAgent.update({
          where: {
            queueId_agentId_organizationId: {
              agentId: currentTicket.assignedTo,
              organizationId,

              queueId: currentTicket.queueId,
            },
          },
          data: {
            ticketCount: { decrement: 1 },
          },
        });
      }

      const updatedTicket = await tx.ticket.update({
        where: { id: ticketId },
        data: {
          assignedTo: nextAgentId,
          queueId: nextQueueId,
          status: 'OPEN',
          priority
        },
      });
      await tx.ticketTransition.create({
        data: {
          ticketId,
          action,
          fromQueueId: currentTicket?.queueId,
          toQueueId: updatedTicket.queueId,
          fromAgentId: currentTicket?.assignedTo,
          toAgentId: updatedTicket.assignedTo,
          escalationReason: reason,
          organizationId,
        },
      });
      // increment new agent
      await tx.queueAgent.update({
        where: {
          queueId_agentId_organizationId: {
            agentId: nextAgentId,
            organizationId,
            // ! ts ignore undefined field
            queueId: updatedTicket.queueId!,
          },
        },
        data: {
          ticketCount: { increment: 1 },
        },
      });

      return { currentTicket, updatedTicket };
    });
    return ticketData;
  };
}
