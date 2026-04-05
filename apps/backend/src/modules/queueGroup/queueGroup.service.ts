import { CreateQueueGroupInput } from "@repo/schemas";
import { appError } from "../../core/utils/appError";
import { prisma } from "../../core/utils/prismaClient";
import { ActivityService } from "../activity/activity.service";

export class QueueGroupService {
  static createQueueGroup = async ({
    userId,
    organizationId,
    input,
  }: {
    userId: string;
    organizationId: string;
    input: CreateQueueGroupInput;
  }) => {
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
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "new queue group is created ",
      event: "queueGroup.create",
      entityId: queueGroup.id,
      entityType: "ORGANIZATION",
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
  static updateQueueGroup = async ({
    groupId,
    userId,
    organizationId,
    input,
  }: {
    groupId: string;
    organizationId: string;
    input: CreateQueueGroupInput;
    userId: string;
  }) => {
    const queueGroup = await prisma.queueGroup.update({
      where: {
        id: groupId,
        organizationId,
      },
      data: input,
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "new queue group is created ",
      event: "queueGroup.create",
      entityId: queueGroup.id,
      entityType: "ORGANIZATION",
      oldData: input,
      newData: queueGroup,
    });
    return queueGroup;
  };
  static deleteQueueGroup = async ({
    groupId,
    organizationId,
    userId,
  }: {
    groupId: string;
    organizationId: string;
    userId: string;
  }) => {
    const queuesInGroup = await prisma.queue.count({
      where: {
        queueGroupId: groupId,
        organizationId,
        active: true,
      },
    });
    if (queuesInGroup > 0) {
      throw new appError("Cannot delete queue group with active queues", 400, "CONFLICT_ERROR");
    }
    await prisma.queueGroup.update({
      where: {
        id: groupId,
        organizationId,
      },
      data: {
        active: false,
      },
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "queue deleted successfully  ",
      event: "queueGroup.create",
      entityId: groupId,
      entityType: "ORGANIZATION",
      oldData: { active: true },
      newData: { active: false },
    });
  };
  static setDefaultGroup = async ({
    groupId,
    organizationId,
    userId,
  }: {
    groupId: string;
    organizationId: string;
    userId: string;
  }) => {
    const currentState = await prisma.queueGroup.findFirst({
      where: {
        organizationId,
      },
      select: {
        default: true,
      },
    });
    if (currentState?.default)
      throw new appError("Queue group is already set to default ", 409, "CONFLICT_ERROR");
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
        id: groupId,
        organizationId,
      },
      data: {
        default: true,
      },
      select: {
        default: true,
      },
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "change default group ",
      event: "queueGroup.create",
      entityId: groupId,
      entityType: "ORGANIZATION",
      oldData: currentState,
      newData: queueGroup,
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
  };
}
