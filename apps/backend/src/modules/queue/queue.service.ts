import { CreateQueueInput, UpdateQueueInput } from "@repo/schemas";
import { appError } from "../../core/utils/appError";
import { prisma } from "../../core/utils/prismaClient";

export class QueueService {
  static create = async (organizationId: string, input: CreateQueueInput) => {
    const queue = await prisma.queue.create({
      data: {
        organizationId,
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
