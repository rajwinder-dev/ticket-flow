import { CreateQueueGroupInput } from '@org/zod';
import { ParsedQs } from 'qs';
import { APIFeatures } from '../../core/utils/apiFeatures.js';
import { appError } from '../../core/utils/appError.js';
import { ActivityService } from '../activity/activity.service.js';
import { getTenantClient } from '@org/database';

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
    const tenentDb = getTenantClient(organizationId);
    const existingDefaultGroup = await tenentDb.queueGroup.findFirst({
      where: {
        organizationId,
        default: true,
      },
    });
    const queueGroup = await tenentDb.queueGroup.create({
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
      actorType: 'USER',
      message: 'new queue group is created ',
      event: 'queueGroup.create',
      entityId: queueGroup.id,
      entityType: 'ORGANIZATION',
    });
    return queueGroup;
  };
  static getAllQueueGroups = async (
    organizationId: string,
    queryString: ParsedQs,
  ) => {
    const { filterOptions, limit, offset } = new APIFeatures(
      queryString,
    ).pagination();
    const tenentDb = getTenantClient(organizationId);
    const queueGroups = await tenentDb.queueGroup.findMany({
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
    const total = await tenentDb.queueGroup.count({
      where: {
        organizationId,
        active: true,
        ...filterOptions.where,
      },
    });
    const result = queueGroups.map((group) => {
      const totalAgents = group.queues.reduce(
        (sum, q) => sum + q._count.queueAgents,
        0,
      );

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
    const tenantDb = getTenantClient(organizationId);
    const queueGroup = await tenantDb.queueGroup.update({
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
      actorType: 'USER',
      message: 'queue group is updated ',
      event: 'queueGroup.update',
      entityId: queueGroup.id,
      entityType: 'ORGANIZATION',
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
    const tenantDb = getTenantClient(organizationId);
    const queuesInGroup = await tenantDb.queue.count({
      where: {
        queueGroupId: groupId,
        organizationId,
        active: true,
      },
    });
    if (queuesInGroup > 0) {
      throw new appError(
        'Cannot delete queue group with active queues',
        400,
        'CONFLICT_ERROR',
      );
    }
    await tenantDb.queueGroup.update({
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
      actorType: 'USER',
      message: 'queue deleted successfully  ',
      event: 'queueGroup.delete',
      entityId: groupId,
      entityType: 'ORGANIZATION',
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
    const tenantdb = getTenantClient(organizationId);
    const { queueGroup, currentState } = await tenantdb.$transaction(
      async (tx) => {
        const currentState = await tx.queueGroup.findFirst({
          where: {
            organizationId,
            id: groupId,
          },
          select: {
            default: true,
          },
        });
        await tx.queueGroup.updateMany({
          where: {
            organizationId,
          },
          data: {
            default: false,
          },
        });

        const queueGroup = await tx.queueGroup.update({
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

        return { queueGroup, currentState };
      },
    );
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: 'USER',
      message: 'change default group ',
      event: 'queueGroup.default',
      entityId: groupId,
      entityType: 'ORGANIZATION',
      oldData: currentState,
      newData: queueGroup,
    });
    return queueGroup;
  };
  static getDefaultGroup = async (organizationId: string) => {
    const tenantdb = getTenantClient(organizationId);
    const defaultGroup = await tenantdb.queueGroup.findFirst({
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
