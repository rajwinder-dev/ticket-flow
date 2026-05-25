import { CreateQueueGroupInput } from "@repo/schemas";
import { ParsedQs } from "qs";
import { APIFeatures } from "../../core/utils/apiFeatures.js";
import { appError } from "../../core/utils/appError.js";
import { ActivityService } from "../activity/activity.service.js";
import { prisma } from "@repo/database";

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
        name: input.name,
        description: input.description,
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
  static getAllQueueGroups = async (organizationId: string, queryString: ParsedQs) => {
    const { filterOptions, limit, offset } = new APIFeatures(queryString).pagination();
    const queueGroups = await prisma.queueGroup.findMany({
      where: {
        organizationId,
        active: true,
        ...filterOptions.where,
      },
      select: {
        id: true,
        name: true,
        description: true,
        default: true,
        _count: {
          select: {
            queues: true,
          },
        },
        queues: {
          select: {
            _count: {
              select: {
                queueAgents: true,
              },
            },
            queueAgents: {
              select: {
                ticketCount: true,
              },
            },
          },
        },
      },
      skip: offset,
      take: limit,
    });
    const total = await prisma.queueGroup.count({
      where: {
        organizationId,
        active: true,
        ...filterOptions.where,
      },
    });
    const result = queueGroups.map((group) => {
      const totalAgents = group.queues.reduce((sum, q) => sum + q._count.queueAgents, 0);

      return {
        id: group.id,
        name: group.name,
        description: group.description,
        queueCount: group._count.queues,
        queueAgentsCount: totalAgents,
        default: group.default,
      };
    });
    return { data: result, pagination: { total, limit, offset } };
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
      data: {
        name: input.name,
        description: input.description,
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
        id: groupId,
      },
      select: {
        default: true,
      },
    });
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
      select: {
        id: true,
      },
    });
    return defaultGroup?.id;
  };
}
