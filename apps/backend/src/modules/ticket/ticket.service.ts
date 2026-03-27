import { Priority, TicketStatus } from "../../../generated/prisma";
import { appError } from "../../core/utils/appError";
import { prisma } from "../../core/utils/prismaClient";
import { readableId } from "../../core/utils/utils";
import { QueueGroupService } from "../queue/queue-group.service";
import { QueueService } from "../queue/queue.service";

export class TicketService {
  private static allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
    OPEN: ["IN_PROGRESS", "CLOSED"],
    IN_PROGRESS: ["RESOLVED", "ON_HOLD"],
    ON_HOLD: ["IN_PROGRESS"],
    RESOLVED: ["CLOSED", "REOPENED"],
    REOPENED: ["IN_PROGRESS"],
    CLOSED: [],
  };
  static createTicket = async ({
    subject,
    description,
    organizationId,
    customerId,
    assignedTo,
    queueId,
  }: {
    subject: string;
    description: string;
    organizationId: string;
    customerId: string;
    assignedTo?: string;
    queueId?: string;
  }) => {
    const ticket = await prisma.ticket.create({
      data: {
        code: readableId("TKT"),
        subject,
        description,
        organizationId,
        customerId,
        assignedTo,
        queueId
      },
    });
    return ticket;
  };
  static resolveQueueAssignment = async (organizationId: string) => {
    // todo: later add category based select group if not then default
    let groupId, queueId;
    const group = await QueueGroupService.getDefaultGroup(organizationId);
    if (group) {
      groupId = group.id;
      // always select lower order queue
      const queue = await QueueService.getLowerOrderQueue(group.id, organizationId);
      if (queue) queueId = queue.id;
    }
    return { groupId, queueId };
  };
  static resolveAgentAssignment = async (queueId: string, organizationId: string) => {
    // todo: later add strategies  round-rebin, ,load balance and availability
    const queueAgents = await QueueService.getQueueAgents(queueId, organizationId);
    if (queueAgents.length === 0) return null;
    const agent = queueAgents[0];
    return agent;
  };
  static updateStatus = async (
    ticketId: string,
    organizationId: string,
    currentStatus: TicketStatus,
    nextStatus: TicketStatus,
  ) => {
    if (!this.allowedTransitions[currentStatus].includes(nextStatus)) {
      throw new appError("Invalid transition", 403);
    }
    return await prisma.ticket.update({
      where: {
        id: ticketId,
        organizationId,
      },
      data: {
        status: nextStatus,
      },
    });
  };
  static updatePriority = async (ticketId: string, organizationId: string, priority: Priority) => {
    return await prisma.ticket.update({
      where: {
        id: ticketId,
        organizationId,
      },
      data: {
        priority,
      },
    });
  };
  static createTicketComment = async (
    ticketId: string,
    authorId: string,
    comment: string,
    isInternal: boolean,
  ) => {
    const data = await prisma.ticketComment.create({
      data: {
        authorId,
        ticketId,
        comment,
        isInternal,
      },
    });
    return data;
  };
  static assignTicket = async (
    ticketId: string,
    organizationId: string,
    assignId: string,
    targetType: "AGENT" | "QUEUE",
  ) => {
    let queueId;
    let agentId;
    if (targetType === "QUEUE") {
      const data = await this.resolveAgentAssignment(ticketId, organizationId);
      agentId = data?.id;
    }
    if (targetType === "AGENT") {
      const queueData = await prisma.queueAgent.findFirst({
        where: {
          agentId: assignId,
          organizationId,
        },
        select: { queueId: true },
      });
      queueId = queueData?.queueId;
      agentId = assignId;
    }
    if (!queueId) throw new appError("Agent is not part of any queue", 404, "NOT_FOUND");
    return await prisma.ticket.update({
      where: {
        id: ticketId,
        organizationId,
      },
      data: {
        assignedTo: agentId,
      },
    });
  };
  static escalateTicket = async (ticketId: string, organizationId: string) => {
    const currentTicket = await prisma.ticket.findUnique({
      where: { id: ticketId, organizationId },
      include: {
        queue: {
          include: {
            queueGroup: true,
          },
        },
      },
    });

    if (!currentTicket?.queue) {
      throw new appError("Invalid Ticket Id", 404, "NOT_FOUND");
    }

    //  find next queue in same group
    const nextQueue = await prisma.queue.findFirst({
      where: {
        queueGroupId: currentTicket.queue.queueGroupId,
        order: currentTicket.queue.order + 1,
      },
    });

    // if no next queue → STOP
    if (!nextQueue) {
      await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          assignedTo: null,
          queueId: null,
        },
      });

      return currentTicket;
    }

    // try to get agent
    const agent = await this.resolveAgentAssignment(nextQueue.id, organizationId);
    if (!agent) {
      await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          assignedTo: null,
          queueId: nextQueue.id
        },
      });

      return currentTicket;
    }

    //  success case
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        assignedTo: agent.id,
        queueId: nextQueue.id,
      },
    });
    return updatedTicket;
  };
}
