import { permissions } from '@org/constants';
import { CreateOrganizationInput } from '@org/zod';
import { readableId } from '../../../core/utils/utils.js';
import { ActivityService } from '../../activity/activity.service.js';
import { getTenantClient, prisma } from '@org/database';
import { APIFeatures } from '../../../core/utils/apiFeatures.js';
import { GetMyOrganizationsRow } from './organization.types.js';
import { ParsedQs } from 'qs';
export class OrganizationService {
  static getMyOrganizations = async ({
    userId,
    queryString,
  }: {
    userId: string;
    queryString: ParsedQs;
  }) => {
    const { limit, offset } = new APIFeatures(queryString).pagination();

    const rows = await prisma.$queryRaw<GetMyOrganizationsRow[]>`
    SELECT * FROM get_my_organizations(${userId}::uuid, ${limit}, ${offset});
  `;

    const total = rows.length > 0 ? Number(rows[0].total_count) : 0;

    const output = rows.map((r) => ({
      id: r.id,
      name: r.name,
      logo: r.logo,
      createdBy: r.createdBy,
      role: r.roleName,
      isOwner: r.isOwner,
    }));
    return { output, total };
  };
  static create = async (userId: string, input: CreateOrganizationInput) => {
    const organization = await prisma.organization.create({
      data: {
        createdBy: userId,
        ...input,
        code: readableId('ORG'),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
      },
    });
    const tenentDb = getTenantClient(organization.id);
    let data;
    try {
      data = await tenentDb.$transaction(async (tx) => {
        const role = await tx.role.create({
          data: {
            name: 'OWNER',
            code: readableId('ROL'),
            organizationId: organization.id,
            permissions: permissions,
            createdBy: userId,
            isSystem: true,
          },
        });
        // create membership
        const membership = await tx.membership.create({
          data: {
            organizationId: role.organizationId,
            userId,
            roleId: role.id,
            isSystem: true,
          },
        });
        await ActivityService.lagActivity({
          organizationId: organization.id,
          actorId: userId,
          actorType: 'USER',
          message: 'User created new organization ',
          event: 'organization.create',
          entityId: organization.id,
          entityType: 'ORGANIZATION',
        });
        return { organization, membership };
      });
    } catch (error) {
      await prisma.organization.delete({
        where: {
          id: organization.id,
        },
      });
      throw error;
    }
    return data;
  };
  static getMembers = async ({
    organizationId,
    queryString,
  }: {
    organizationId: string;
    queryString: any;
  }) => {
    const { filterOptions, limit, offset } = new APIFeatures(queryString)
      .filter()
      .pagination();
    const tenantdb = getTenantClient(organizationId);
    const membership = await tenantdb.membership.findMany({
      where: {
        isSystem: false,
        ...filterOptions.where,
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

            queueAgents: {
              where: { organizationId },
              select: {
                ticketCount: true,
                queue: {
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
        email: user?.email,
        username: user?.name,
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
    const total = await prisma.membership.count({
      where: {
        organizationId,
        ...filterOptions.where,
      },
    });
    return {
      data,
      propagation: {
        total,
        limit,
        offset,
      },
    };
  };
  static onboardingStatus = async (organizationId: string) => {
    const tenantDb = getTenantClient(organizationId);
    const [roles, groups, queues, invites, providers] = await Promise.all([
      tenantDb.role.count({ where: { isSystem: false } }),
      tenantDb.queueGroup.count(),
      tenantDb.queue.count(),
      tenantDb.token.count({ where: { type: 'INVITE_USER' } }),
      tenantDb.emailProvider.count(),
    ]);
    return {
      hasRoles: roles > 0,
      hasGroups: groups > 0,
      hasQueues: queues > 0,
      hasInvites: invites > 0,
      hasEmail: providers > 0,
      currentStep: [roles, groups, queues, invites, providers].filter(
        (c) => c > 0,
      ).length,
    };
  };
}
