import { CreateQueueInput, UpdateQueueInput } from "@repo/schemas";
import { appError } from "../../core/utils/appError.js";
import { getTenantClient, prisma } from "../../core/utils/prismaClient.js";
import { ActivityService } from "../activity/activity.service.js";

export class QueueService {
  static create = async ({
    organizationId,
    queueGroupId,
    input,
    userId,
  }: {
    organizationId: string;
    queueGroupId: string;
    input: CreateQueueInput;
    userId: string;
  }) => {
    const queueOrder = await prisma.queue.count({
      where: {
        organizationId,
        queueGroupId,
      },
    });

    const queue = await prisma.queue.create({
      data: {
        organizationId,
        queueGroupId,
        order: queueOrder + 1,
        ...input,
      },
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "new queue is created ",
      event: "queue.create",
      entityId: queue.id,
      entityType: "ORGANIZATION",
    });
    return queue;
  };
  static getDetails = async ({
    queueId,
    organizationId,
  }: {
    queueId: string;
    organizationId: string;
  }) => {
    const data = await prisma.queue.findUnique({
      where: {
        id: queueId,
        organizationId,
      },
      include: {
        queueGroup: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    return data;
  };
  static getQueueSummary = async ({
    queueId,
    organizationId,
  }: {
    queueId: string;
    organizationId: string;
  }) => {
    const tenantdb = getTenantClient(organizationId);
    const [totalTickets, openTickets, highPriorityTickets, activeAgents] = await Promise.all([
      tenantdb.ticket.count({
        where: {
          queueId,
          organizationId,
        },
      }),
      tenantdb.ticket.count({
        where: {
          queueId,
          status: "OPEN",
          organizationId,
        },
      }),
      tenantdb.ticket.count({
        where: {
          queueId,
          priority: {
            in: ["HIGH", "URGENT"],
          },
          organizationId,
        },
      }),
      prisma.queueAgent.count({
        where: {
          queueId,
          active: true,
          organizationId,
        },
      }),
    ]);

    return {
      totalTickets,
      openTickets,
      highPriorityTickets,
      activeAgents,
    };
  };
  static addAgents = async ({
    queueId,
    organizationId,
    agentIds,
    userId,
  }: {
    queueId: string;
    organizationId: string;
    agentIds: string[];
    userId: string;
  }) => {
    const queueAgents = agentIds.map((agentId) => ({
      queueId,
      agentId,
      organizationId,
    }));
    const existingQueueAgents = await prisma.queueAgent.findMany({
      where: {
        organizationId,
        agentId: {
          in: agentIds,
        },
        active: true,
      },
    });
    const alreadyAssignedAgent = existingQueueAgents.map((qa) => qa.agentId);
    const filteredQueueAgents = queueAgents.filter((qa) =>
      alreadyAssignedAgent.includes(qa.agentId),
    );
    if (filteredQueueAgents.length > 0) {
      const agentNames = await prisma.user.findMany({
        where: {
          id: {
            in: filteredQueueAgents.map((qa) => qa.agentId),
          },
        },
      });
      throw new appError(
        `Some Agents are already assigned to other queues`,
        400,
        "CONFLICT_ERROR",
        { agents: agentNames.map((a) => ({ id: a.id, name: a.email })) },
      );
    }
    //  return already existing agents and newly added agents
    const updatedAgents = await prisma.queueAgent.createManyAndReturn({
      data: queueAgents,
      skipDuplicates: true,
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "agents added in queue ",
      event: "queue.agents.added",
      entityId: queueId,
      oldData: existingQueueAgents,
      newData: updatedAgents,
      entityType: "ORGANIZATION",
    });
    return updatedAgents;
  };
  static removeAgents = async ({
    queueId,
    organizationId,
    agentIds,
    userId,
  }: {
    queueId: string;
    organizationId: string;
    agentIds: string[];
    userId: string;
  }) => {
    const currentState = await prisma.queueAgent.findMany({
      where: {
        queueId,
        organizationId,
        agentId: {
          in: agentIds,
        },
        active: true,
      },
    });
    const deletedAgents = await prisma.queueAgent.updateManyAndReturn({
      where: {
        queueId,
        organizationId,
        agentId: {
          in: agentIds,
        },
        active: true,
      },
      data: {
        active: false,
      },
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "agents removed from queue ",
      event: "queue.agent.remove",
      entityId: queueId,
      oldData: currentState,
      newData: deletedAgents,
      entityType: "ORGANIZATION",
    });
    return deletedAgents;
  };
  static getQueueAgents = async ({
    queueId,
    organizationId,
  }: {
    queueId: string;
    organizationId: string;
  }) => {
    const queueAgents = await prisma.queueAgent.findMany({
      where: {
        queueId,
        organizationId,
      },
      include: {
        user: true,
      },
    });
    return queueAgents.map((qa) => qa.user);
  };
  static update = async ({
    queueId,
    organizationId,
    input,
    userId,
  }: {
    queueId: string;
    organizationId: string;
    input: UpdateQueueInput;
    userId: string;
  }) => {
    const updatedQueue = await prisma.queue.update({
      where: {
        id: queueId,
        organizationId,
        active: true,
      },
      data: input,
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "queue details updated ",
      event: "queue.update",
      entityId: queueId,
      oldData: input,
      newData: updatedQueue,
      entityType: "ORGANIZATION",
    });
    return updatedQueue;
  };
  static delete = async ({
    queueId,
    organizationId,
    userId,
  }: {
    queueId: string;
    organizationId: string;
    userId: string;
  }) => {
    const exitingQueue = await prisma.queue.findUnique({
      where: { id: queueId },
      select: { active: true },
    });
    if (!exitingQueue) throw new appError("Queue not found", 404, "NOT_FOUND");
    if (!exitingQueue?.active)
      throw new appError("Queue is already deleted", 409, "CONFLICT_ERROR");
    const activeTickets = await prisma.ticket.count({
      where: {
        queueId,
        organizationId,
        status: {
          not: "CLOSED",
        },
      },
    });
    if (activeTickets > 0) {
      throw new appError("Cannot delete queue with active tickets", 400, "CONFLICT_ERROR");
    }
    const deletedQueue = await prisma.queue.update({
      where: {
        id: queueId,
        organizationId,
      },
      data: {
        active: false,
      },
      select: {
        active: true,
        queueGroupId: true,
      },
    });
    // rearrange queue order
    const unorderedQueues = await prisma.queue.findMany({
      where: { queueGroupId: deletedQueue.queueGroupId, active: true },
    });
    for (const [index, value] of unorderedQueues.entries()) {
      const newOrder = index + 1;
      if (newOrder !== value.order)
        await prisma.queue.update({ where: { id: value.id }, data: { order: newOrder } });
    }

    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "queue deleted successfully ",
      event: "queue.update",
      entityId: queueId,
      oldData: exitingQueue,
      newData: deletedQueue,
      entityType: "ORGANIZATION",
    });
  };
  static getLowerOrderQueue = async ({
    queueGroupId,
    organizationId,
  }: {
    queueGroupId: string;
    organizationId: string;
  }) => {
    const queue = await prisma.queue.findFirst({
      where: {
        queueGroupId,
        organizationId,
        active: true,
      },
      orderBy: {
        order: "asc",
      },
      select: {
        id: true,
      },
    });
    // if (!queue?.id) throw new appError("Queue Id not found ", 400);
    return queue?.id;
  };
}
