import { QueueGroupInput } from "@repo/schemas";
import { appError } from "../../core/utils/appError";
import { prisma } from "../../core/utils/prismaClient";

export class QueueGroupService {
  static createQueueGroup = async (
    userId: string,
    organizationId: string,
    input: QueueGroupInput,
  ) => {
    const existingDefaultGroup = await prisma.queueGroup.findFirst({
      where: {
        organizationId,
        default: true,
      },
    });
    const queueGroup = await prisma.queueGroup.create({
      data: {
        organizationId,
        createdBy: userId,
        default: existingDefaultGroup ? false : true,
        ...input,
      },
    });
    return queueGroup;
  };
  static getAllQueueGroups = async (organizationId: string) => {
    const queueGroups = await prisma.queueGroup.findMany({
      where: {
        organizationId,
        active: true,
      },
    });
    return queueGroups;
  };
  static updateQueueGroup = async (id: string, organizationId: string, input: QueueGroupInput) => {
    const queueGroup = await prisma.queueGroup.update({
      where: {
        id,
        organizationId,
      },
      data: input,
    });
    return queueGroup;
  };
  static deleteQueueGroup = async (id: string, organizationId: string) => {
    const queuesInGroup = await prisma.queue.count({
      where: {
        queueGroupId: id,
        organizationId,
        active: true,
      },
    });
    if (queuesInGroup > 0) {
      throw new appError("Cannot delete queue group with active queues", 400, "CONFLICT_ERROR");
    }
    await prisma.queueGroup.delete({
      where: {
        id,
        organizationId,
      },
    });
  };
  static setDefaultGroup = async (id: string, organizationId: string) => {
    await prisma.queueGroup.updateMany({
      where: {
        organizationId,
      },
      data: {
        default: false,
      },
    });

    const queueGroup = await prisma.queueGroup.update({
      where: {
        id,
        organizationId,
      },
      data: {
        default: true,
      },
    });
    return queueGroup;
  };
  static getDefaultGroup = async (organizationId: string) => {
    const defaultGroup = await prisma.queueGroup.findFirst({
      where: {
        organizationId,
        default: true,
        active: true,
      },
    });
    return defaultGroup;
  }
}
