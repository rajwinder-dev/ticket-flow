import { getTenantClient } from '@org/database';
import { ParsedQs } from 'qs';
import { APIFeatures } from '../../core/utils/apiFeatures';
import { NotificationService } from '../notification/notification.service';

export class MemberServiceClass {
  async getMembers({
    queueId,
    organizationId,
    queryString,
  }: {
    organizationId: string;
    queueId: string;
    queryString: ParsedQs;
  }) {
    const tenantdb = getTenantClient(organizationId);
    const queuefilter = queueId
      ? { user: { queueAgents: { some: { queueId } } } }
      : {};
    const { filterOptions, limit, offset } = new APIFeatures(queryString, {
      ignore: ['queueId'],
    })
      .filter()
      .pagination();
    const membership = await tenantdb.membership.findMany({
      where: {
        organizationId,
        isSystem: false,
        ...filterOptions.where,
        ...queuefilter,
      },
      select: {
        organizationId: true,
        id: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            email: true,
            name: true,
            avatar: true,
            id: true,
            queueAgents: {
              where: { organizationId },
              select: {
                ticketCount: true,
                queueId: true,
                queue: {
                  where: { organizationId },
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      skip: offset,
      take: limit,
    });

    const data = membership.map((item) => {
      const user = item.user;

      const totalTickets = user?.queueAgents.reduce(
        (sum, qa) => sum + qa.ticketCount,
        0,
      );

      return {
        id: item.id,
        userId: item.user?.id,
        email: user?.email,
        name: user?.name,
        avatar: user?.avatar,
        role: item.role?.name,
        roleId: item.role?.id,
        createdAt: item.createdAt,
        organizationId: item.organizationId,
        totalTickets,
        queues: user?.queueAgents.map((qa) => ({
          queueId: qa.queue?.id,
          name: qa.queue?.name,
          ticketCount: qa.ticketCount,
        })),
      };
    });
    const total = await tenantdb.membership.count({
      where: {
        organizationId,
        ...filterOptions.where,
      },
    });
    return { data, total, limit, offset };
  }
  async updateRole({
    userId,
    roleId,
    organizationId,
  }: {
    userId: string;
    roleId: string;
    organizationId: string;
  }) {
    const tenantdb = getTenantClient(organizationId);
    const data = await tenantdb.membership.update({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
      data: {
        roleId,
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    await NotificationService.sendNotification({
      recipientId: userId,
      userId,
      data: {
        organizationId: data.organizationId,
        channel: 'IN_APP',
        title: 'Your role changed',
        message: `Your role has been changed to ${data.role?.name}`,
        type: 'RBAC',
        actorId: userId,
      },
    });

    return data;
  }
  async assignQueue({
    userId,
    queueId,
    organizationId,
  }: {
    userId: string;
    queueId: string;
    organizationId: string;
  }) {
    const tenantdb = getTenantClient(organizationId);

    const data = await tenantdb.queueAgent.upsert({
      where: {
        queueId_agentId_organizationId: {
          queueId,
          agentId: userId,
          organizationId,
        },
      },
      update: {},
      create: {
        queueId,
        agentId: userId,
        organizationId,
      },
    });
    await NotificationService.sendNotification({
      recipientId: userId,
      userId,
      data: {
        organizationId: data.organizationId,
        channel: 'IN_APP',
        title: 'Queue assigned',
        message: `You have been assigned to a queue`,
        type: 'QUEUE',
        actorId: userId,
      },
    });
    return data;
  }
  async unassignedQueue({
    organizationId,
    queueId,
    userId,
  }: {
    organizationId: string;
    queueId: string;
    userId: string;
  }) {
    const tenantdb = getTenantClient(organizationId);
    await tenantdb.queueAgent.delete({
      where: {
        queueId_agentId_organizationId: {
          queueId,
          agentId: userId,
          organizationId,
        },
      },
    });
    await NotificationService.sendNotification({
      recipientId: userId,
      userId,
      data: {
        organizationId,
        channel: 'IN_APP',
        title: 'Queue unassigned',
        message: `You have been removed to a queue`,
        type: 'QUEUE',
        actorId: userId,
      },
    });
  }
}

export const MemberService = new MemberServiceClass();
