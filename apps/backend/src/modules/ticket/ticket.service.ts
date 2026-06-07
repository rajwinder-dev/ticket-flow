import { allowedTransitions } from "@repo/constants";
import { CreateTicketInput, TicketPriority, UpdateTicketInput } from "@repo/schemas";
import { ParsedQs } from "qs";
import { APIFeatures } from "../../core/utils/apiFeatures.js";
import { appError } from "../../core/utils/appError.js";
import {
  getTenantClient,
  prisma,
  Priority,
  priority,
  TicketAction,
  TicketStatus,
} from "@repo/database";
import { readableId } from "../../core/utils/utils.js";
import { ActivityService } from "../activity/activity.service.js";
import { CustomerService } from "../customer/customer.service.js";
import { QueueService } from "../queue/queue.service.js";
import { QueueGroupService } from "../queueGroup/queueGroup.service.js";
import { log } from "@repo/utils";

export class TicketService {
  static createAndAssign = async ({
    input,
    organizationId,
    userId,
  }: {
    input: CreateTicketInput;
    organizationId: string;
    userId?: string;
  }) => {
    const { email, assignment, ...data } = input;
    let groupId = assignment?.groupId;
    let queueId = assignment?.queueId;
    let agentId = assignment?.agentId;

    const customerData = await CustomerService.createCustomerIdentity(email, organizationId);
    if (!groupId) {
      groupId = await QueueGroupService.getDefaultGroup(organizationId);
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
    });

    if (agentId && queueId) {
      await this.updateTicketMovement({
        ticketId: ticket.id,
        nextAgentId: agentId,
        nextQueueId: queueId,
        organizationId,
        action: "ASSIGNED",
      });
      await ActivityService.lagActivity({
        organizationId,
        actorId: userId,
        actorType: assignment?.agentId ? "USER" : "SYSTEM",
        message: "ticket escalated ",
        event: "ticket.assigned",
        entityId: ticket.id,
        entityType: "TICKET",
      });
      return finalAssignment;
    }
  };
  static createTicket = async ({
    data,
    organizationId,
    customerId,
    assignedTo,
    queueId,
    userId,
  }: {
    data: { subject: string; description: string; priority: priority; category: string };
    organizationId: string;
    customerId: string;
    assignedTo?: string;
    queueId?: string;
    userId?: string;
  }) => {
    const tenantDb = getTenantClient(organizationId);
    const ticket = await tenantDb.ticket.create({
      data: {
        code: readableId("TKT"),
        ...data,
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
  static updateTicket = async ({
    input,
    ticketId,
    organizationId,
    userId,
  }: {
    input: UpdateTicketInput;
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
      actorType: "USER",
      message: "ticket updated is created",
      event: "ticket.updated",
      entityId: ticketId,
      entityType: "TICKET",
      oldData: input,
      newData: updatedTicket,
    });
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
        updatedAt: true,
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
    if (!data) throw new appError("Ticket not found ", 404, "NOT_FOUND");

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
    // * load balance strategy
    const agent = await prisma.queueAgent.findFirst({
      where: {
        queueId,
        organizationId,
        active: true,
      },

      orderBy: {
        ticketCount: "asc",
      },
    });
    return agent?.agentId;
  };
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
    if (!currentData) throw new appError("Ticket not found", 404);

    // validate allowed status
    if (!allowedTransitions[currentData.status].includes(nextStatus)) {
      throw new appError("Invalid transition", 403);
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
          throw new appError("Ticket already updated , refresh again", 409, "VERSION_MISSMATCH", {
            currenVersion: existTicket.version,
          });
      }

      const { queueId, assignedTo } = currentData;

      if (nextStatus === "CLOSED" && queueId && assignedTo) {
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
      if (nextStatus === "REOPENED" && queueId && assignedTo) {
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
          action: "STATUS_CHANGED",
          fromStatus: currentData?.status,
          toStatus: nextStatus,
          organizationId,
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
      entityId: ticketId,
      entityType: "TICKET",
      oldData: { status: currentData.status },
      newData: { status: nextStatus },
    });
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
    const currentTicket = await tanentDb.ticket.findUnique({
      where: { id: ticketId },
      select: { priority: true },
    });
    const ticket = await tanentDb.$transaction(async (tx) => {
      const updatedTicket = await tx.ticket.updateMany({
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
      if (updatedTicket.count === 0) {
        const existTicket = await tanentDb.ticket.findUnique({
          where: { id: ticketId },
          select: { version: true },
        });
        if (existTicket)
          throw new appError("Ticket already updated , refersh", 409, "VERSION_MISSMATCH", {
            currenVersion: existTicket.version,
          });
      }
      await tx.ticketTransition.create({
        data: {
          ticketId,
          action: "PRIORITY_CHANGED",
          toPriority: priority,
          fromPriority: currentTicket?.priority,
          organizationId,
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
      entityId: ticketId,
      entityType: "TICKET",
      oldData: { priority: currentTicket?.priority },
      newData: { priority: priority },
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
  static getTicketComments = async ({
    ticketId,
    organizationId,
    queryString,
  }: {
    ticketId: string;
    organizationId: string;
    queryString: ParsedQs;
  }) => {
    const { offset, limit } = new APIFeatures(queryString).pagination();
    const comments = await prisma.ticketComment.findMany({
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
      orderBy: { createdAt: "asc" },
      take: limit,
      skip: offset,
    });
    const total = await prisma.ticketComment.count({
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
          agentId = await this.resolveAgentAssignment({
            queueId: assignId,
            organizationId,
          });
        }
        break;
      case "AGENT":
        // if agent given , find agent and it queueID
        {
          const queueData = await prisma.queueAgent.findFirst({
            where: {
              agentId,
              organizationId,
              active: true,
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
    input,
  }: {
    input: {
      priority: TicketPriority;
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
        queueGroupId: input.groupId || currentTicket.queue.queueGroupId,
        order: {
          gt: input.groupId ? 0 : currentTicket.queue.order,
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
      throw new appError("No further queue. Please select another group.", 409, "CONFLICT_ERROR");

    // try to get agent
    const agentId = await this.resolveAgentAssignment({ queueId: nextQueue.id, organizationId });
    if (!agentId) throw new appError("No Agent found.", 409, "CONFLICT_ERROR");

    const updatedTicket = await this.updateTicketMovement({
      ticketId,
      nextQueueId: nextQueue.id,
      nextAgentId: agentId,
      organizationId,
      action: "ESCALATED",
      reason: input.reason,
    });
    await TicketService.createTicketComment({
      ticketId,
      organizationId,
      userId,
      comment: input.comment,
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
    reason,
  }: {
    ticketId: string;
    nextAgentId: string;
    nextQueueId: string;
    organizationId: string;
    action: TicketAction;
    reason?: string;
  }) => {
    const tenantDb = getTenantClient(organizationId);
    const ticketData = await tenantDb.$transaction(async (tx) => {
      const currentTicket = await tx.ticket.findUnique({
        where: { id: ticketId },
      });
      // ! ts ignore undefined case
      //  todo: if queue id not in ticket then find
      // decrement previous agent (only if different)
      if (currentTicket?.assignedTo && currentTicket.assignedTo !== nextAgentId) {
        console.log(organizationId, currentTicket.assignedTo, currentTicket.queueId);
        await tx.queueAgent.update({
          where: {
            queueId_agentId_organizationId: {
              agentId: currentTicket.assignedTo,
              organizationId,

              queueId: currentTicket.queueId!,
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
  static escalationOptions = async ({
    organizationId,
    ticketId,
  }: {
    organizationId: string;
    ticketId: string;
  }) => {
    let nextQueue: { id: string; name: string } | null = null;
    const tenantDb = getTenantClient(organizationId);
    const queueData = await tenantDb.ticket.findUnique({
      where: {
        id: ticketId,
        organizationId,
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
      nextQueue = await prisma.queue.findFirst({
        where: {
          organizationId,
          queueGroupId: queueData.queue.queueGroupId,
          order: queueData.queue.order + 1,
        },
        select: {
          id: true,
          name: true,
        },
      });
    }

    return {
      currentQueue: {
        id: queueData.queue.id,
        name: queueData.queue.name,
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
    const { offset, limit } = new APIFeatures(queryString).pagination();
    const total = await prisma.ticketTransition.count({
      where: {
        organizationId,
        ticketId,
      },
    });
    const data = await prisma.ticketTransition.findMany({
      where: {
        organizationId,
        ticketId,
      },
      orderBy: { createdAt: "desc" },
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
