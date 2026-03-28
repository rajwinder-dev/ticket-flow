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
    const ticket = await prisma.$transaction(async (tx) => {
      const data = await prisma.ticket.create({
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
      if (assignedTo)
        await tx.queueAgent.update({
          where: {
            agentId_organizationId: {
              agentId: assignedTo,
              organizationId,
            },
          },
          data: {
            ticketCount: {
              increment: 1,
            },
          },
        });
      return data;
    });
    return ticket;
  };
  static getTicketDetails = async (ticketId: string, organizationId: string) => {
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
      const queue = await QueueService.getLowerOrderQueue(group.id, organizationId);
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
    const queueAgents = await QueueService.getQueueAgents(queueId, organizationId);
    if (queueAgents.length === 0) return null;
    const agent = queueAgents[0];
    return agent;
  };
  static updateStatus = async ({
    ticketId,
    organizationId,
    currentStatus,
    nextStatus,
  }: {
    ticketId: string;
    organizationId: string;
    currentStatus: TicketStatus;
    nextStatus: TicketStatus;
  }) => {
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
  static updatePriority = async ({
    ticketId,
    organizationId,
    priority,
  }: {
    ticketId: string;
    organizationId: string;
    priority: Priority;
  }) => {
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
    isInternal?: boolean,
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
  static assignTicket = async ({
    ticketId,
    organizationId,
    assignId,
    targetType,
  }: {
    ticketId: string;
    organizationId: string;
    assignId: string;
    targetType: "AGENT" | "QUEUE";
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
          const queueData = await prisma.queueAgent.findUnique({
            where: {
              agentId_organizationId: {
                agentId: assignId,
                organizationId,
              },
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

    return await this.updateTicketMovement({
      ticketId,
      organizationId,
      nextAgentId: agentId,
      nextQueueId: queueId,
    });
  };
  static escalateTicket = async ({
    ticketId,
    organizationId,
  }: {
    ticketId: string;
    organizationId: string;
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
            queueAgents: true
          }
        }// or relation you use
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
    });
    // update ticket count for new Agent
    return updatedTicket;
  };
  static updateTicketMovement = async ({
    ticketId,
    nextAgentId,
    nextQueueId,
    organizationId,
  }: {
    ticketId: string;
    nextAgentId: string;
    nextQueueId: string;
    organizationId: string;
  }) => {
    const updatedTicket = await prisma.$transaction(async (tx) => {
      const current = await tx.ticket.findUnique({
        where: { id: ticketId },
        select: { assignedTo: true },
      });

      // decrement previous agent (only if different)
      if (current?.assignedTo && current.assignedTo !== nextAgentId) {
        await tx.queueAgent.update({
          where: {
            agentId_organizationId: {
              agentId: current.assignedTo,
              organizationId,
            },
          },
          data: {
            ticketCount: { decrement: 1 },
          },
        });
      }

      const updated = await tx.ticket.update({
        where: { id: ticketId },
        data: {
          assignedTo: nextAgentId,
          queueId: nextQueueId,
          status: "OPEN",
        },
      });

      // increment new agent
      await tx.queueAgent.update({
        where: {
          agentId_organizationId: {
            agentId: nextAgentId,
            organizationId,
          },
        },
        data: {
          ticketCount: { increment: 1 },
        },
      });

      return updated;
    });
    return updatedTicket;
  };
}
