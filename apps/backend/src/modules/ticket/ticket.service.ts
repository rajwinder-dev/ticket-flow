import { Priority, TicketAction, TicketStatus } from "../../../generated/prisma";
import { appError } from "../../core/utils/appError";
import { prisma } from "../../core/utils/prismaClient";
import { readableId } from "../../core/utils/utils";
import { ActivityService } from "../activity/activity.service";
import { QueueService } from "../queue/queue.service";
import { QueueGroupService } from "../queueGroup/queueGroup.service";

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
    userId,
  }: {
    subject: string;
    description: string;
    organizationId: string;
    customerId: string;
    assignedTo?: string;
    queueId?: string;
    userId: string;
  }) => {
    const ticket = await prisma.ticket.create({
      data: {
        code: readableId("TKT"),
        subject,
        description,
        organizationId,
        customerId,
        assignedTo,
        queueId,
      },
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "new ticket is created",
      event: "ticket.created",
      entityId: ticket.id,
      entityType: "TICKET",
    });

    return ticket;
  };
  static getTicketDetails = async ({
    ticketId,
    organizationId,
  }: {
    ticketId: string;
    organizationId: string;
  }) => {
    const data = await prisma.ticket.findUnique({
      where: {
        organizationId,
        id: ticketId,
      },
      include: {
        comments: {
          select: {
            comment: true,
            createdAt: true,
            updatedAt: true,
            author: {
              select: {
                email: true,
                username: true,
              },
            },
          },
        },
        transitions: true,
        assignedToUser: {
          select: {
            email: true,
            username: true,
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

    return data;
  };
  static resolveQueueAssignment = async ({ organizationId }: { organizationId: string }) => {
    // todo: later add category based select group if not then default
    let groupId, queueId;
    const group = await QueueGroupService.getDefaultGroup(organizationId);
    if (group) {
      groupId = group.id;
      // always select lower order queue
      const queue = await QueueService.getLowerOrderQueue({
        queueGroupId: group.id,
        organizationId,
      });
      if (queue) queueId = queue.id;
    }
    return { groupId, queueId };
  };
  static resolveAgentAssignment = async ({
    queueId,
    organizationId,
  }: {
    queueId: string;
    organizationId: string;
  }) => {
    // todo: later add strategies  round-rebin, ,load balance and availability
    const queueAgents = await QueueService.getQueueAgents({ queueId, organizationId });
    if (queueAgents.length === 0) return null;
    const agent = queueAgents[0];
    return agent;
  };
  static updateStatus = async ({
    ticketId,
    organizationId,
    currentStatus,
    nextStatus,
    userId,
  }: {
    ticketId: string;
    organizationId: string;
    currentStatus: TicketStatus;
    nextStatus: TicketStatus;
    userId: string;
  }) => {
    if (!this.allowedTransitions[currentStatus].includes(nextStatus)) {
      throw new appError("Invalid transition", 403);
    }
    const ticket = await prisma.$transaction(async (tx) => {
      const updatedTicket = await prisma.ticket.update({
        where: {
          id: ticketId,
          organizationId,
        },
        data: {
          status: nextStatus,
        },
      });
      await tx.ticketTransition.create({
        data: {
          ticketId,
          action: "STATUS_CHANGED",
          fromStatus: currentStatus,
          toStatus: updatedTicket.status,
        },
      });
      return updatedTicket;
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "ticket status updated ",
      event: "ticket.update",
      entityId: ticket.id,
      entityType: "TICKET",
      oldData: { status: currentStatus },
      newData: { status: ticket.priority },
    });
    return ticket;
  };
  static updatePriority = async ({
    ticketId,
    organizationId,
    priority,
    userId,
  }: {
    ticketId: string;
    organizationId: string;
    priority: Priority;
    userId: string;
  }) => {
    const currentTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { priority: true },
    });
    const ticket = await prisma.$transaction(async (tx) => {
      const updatedTicket = await tx.ticket.update({
        where: {
          id: ticketId,
          organizationId,
        },
        data: {
          priority,
        },
      });
      await tx.ticketTransition.create({
        data: {
          ticketId,
          action: "PRIORITY_CHANGED",
          toPriority: updatedTicket.priority,
          fromPriority: currentTicket?.priority,
        },
      });
      return updatedTicket;
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "ticket priority changed ",
      event: "ticket.update",
      entityId: ticket.id,
      entityType: "TICKET",
      oldData: { status: currentTicket?.priority },
      newData: { status: ticket.priority },
    });
    return ticket;
  };
  static createTicketComment = async ({
    organizationId,
    ticketId,
    userId,
    comment,
    isInternal,
  }: {
    ticketId: string;
    userId: string;
    comment: string;
    isInternal?: boolean;
    organizationId: string;
  }) => {
    const data = await prisma.ticketComment.create({
      data: {
        authorId: userId,
        ticketId,
        comment,
        isInternal,
        organizationId,
      },
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "user added comment in ticket ",
      event: "ticket.comment.created",
      entityId: data.id,
      entityType: "TICKET",
    });
    return data;
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
    targetType: "AGENT" | "QUEUE";
    userId: string;
  }) => {
    let queueId;
    let agentId;
    switch (targetType) {
      // if queue given , resovle agent only
      case "QUEUE":
        {
          const agentData = await this.resolveAgentAssignment({
            queueId: assignId,
            organizationId,
          });
          agentId = agentData?.id;
        }
        break;
      case "AGENT":
        // if agent given , find agent and it queueID
        {
          const queueData = await prisma.queueAgent.findFirst({
            where: {
              agentId,
              organizationId,
              active: true
            },
            select: { queueId: true },
          });
          queueId = queueData?.queueId;
          agentId = assignId;
        }
        break;
      default:
        throw new appError("Invalid targetType ", 400);
    }
    if (!queueId) throw new appError("Queue not found ", 404, "NOT_FOUND");
    if (!agentId) throw new appError("Agent not found in queue", 404, "NOT_FOUND");
    if (agentId === assignId)
      throw new appError("Already assigned to agent ", 409, "CONFLICT_ERROR");

    const { updatedTicket, currentTicket } = await this.updateTicketMovement({
      ticketId,
      organizationId,
      nextAgentId: agentId,
      nextQueueId: queueId,
      action: "ASSIGNED",
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "ticket assignment updated ",
      event: "ticket.agent.assigned",
      entityId: ticketId,
      entityType: "TICKET",
      oldData: currentTicket,
      newData: updatedTicket,
    });
    return updatedTicket;
  };
  static escalateTicket = async ({
    ticketId,
    organizationId,
    userId,
  }: {
    ticketId: string;
    organizationId: string;
    userId?: string;
  }) => {
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
    if (!currentTicket?.priority) throw new appError("Update priority before escalate", 400);
    if (!currentTicket?.queue) {
      throw new appError("Invalid Ticket Id", 404, "NOT_FOUND");
    }
    //  find next queue in same group
    const nextQueues = await prisma.queue.findMany({
      where: {
        queueGroupId: currentTicket.queue.queueGroupId,
        order: {
          gt: currentTicket.queue.order,
        },
      },
      include: {
        _count: {
          select: {
            queueAgents: true,
          },
        }, // or relation you use
      },
      orderBy: {
        order: "asc",
      },
    });
    const nextQueue = nextQueues.find((q) => q._count.queueAgents > 0);
    if (!nextQueue)
      throw new appError("No further queue. Please assign manually.", 409, "CONFLICT_ERROR");

    // try to get agent
    const agent = await this.resolveAgentAssignment({ queueId: nextQueue.id, organizationId });
    if (!agent) throw new appError("No Agent found.", 409, "CONFLICT_ERROR");

    const updatedTicket = await this.updateTicketMovement({
      ticketId,
      nextQueueId: nextQueue.id,
      nextAgentId: agent.id,
      organizationId,
      action: "ESCALATED",
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: userId ? "USER" : "SYSTEM",
      message: "ticket escalated ",
      event: "ticket.agent.escalated",
      entityId: ticketId,
      entityType: "TICKET",
      oldData: currentTicket,
      newData: updatedTicket,
    });
    // update ticket count for new Agent
    return updatedTicket;
  };
  static updateTicketMovement = async ({
    ticketId,
    nextAgentId,
    nextQueueId,
    organizationId,
    action,
  }: {
    ticketId: string;
    nextAgentId: string;
    nextQueueId: string;
    organizationId: string;
    action: TicketAction;
  }) => {
    const ticketData = await prisma.$transaction(async (tx) => {
      const currentTicket = await tx.ticket.findUnique({
        where: { id: ticketId },
      });
// ! ts ignore undefined case
//  todo: if queue id not in ticket then find
      // decrement previous agent (only if different)
      if (currentTicket?.assignedTo && currentTicket.assignedTo !== nextAgentId) {
        await tx.queueAgent.update({
          where: {
            queueId_agentId_organizationId: {
              agentId: currentTicket.assignedTo,
              organizationId,

              queueId: currentTicket.queueId!
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
          status: "OPEN",
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
        },
      });
      // increment new agent
      await tx.queueAgent.update({
        where: {
          queueId_agentId_organizationId: {
            agentId: nextAgentId,
            organizationId,
            // ! ts ignore undefined field
            queueId: updatedTicket.queueId!
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
