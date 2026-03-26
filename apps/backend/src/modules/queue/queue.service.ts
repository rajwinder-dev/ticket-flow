import { CreateQueueInput, UpdateQueueInput } from "@repo/schemas";
import { appError } from "../../core/utils/appError";
import { prisma } from "../../core/utils/prismaClient";

export class QueueService {
  static create = async (organizationId: string, queueGroupId: string, input: CreateQueueInput) => {
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
    return queue;
  };
  static addAgents = async (queueId: string, organizationId: string, agentIds: string[]) => {
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
    return await prisma.queueAgent.createMany({
      data: queueAgents,
      skipDuplicates: true,
    });
  };
  static removeAgents = async (queueId: string, organizationId: string, agentIds: string[]) => {
    return await prisma.queueAgent.deleteMany({
      where: {
        queueId,
        organizationId,
        agentId: {
          in: agentIds,
        },
      },
    });
  };
  static getQueueAgents = async (queueId: string, organizationId: string) => {
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
  static update = async (id: string, organizationId: string, input: UpdateQueueInput) => {
    const queue = await prisma.queue.update({
      where: {
        id,
        organizationId,
      },
      data: input,
    });
    return queue;
  };
  static delete = async (id: string, organizationId: string) => {
    const activeTickets = await prisma.ticket.count({
      where: {
        queueId: id,
        organizationId,
        status: {
          not: "CLOSED",
        },
      },
    });
    if (activeTickets > 0) {
      throw new appError("Cannot delete queue with active tickets", 400, "CONFLICT_ERROR");
    }
    await prisma.queue.update({
      where: {
        id,
        organizationId,
      },
      data: {
        active: false,
      },
    });
  };
}
