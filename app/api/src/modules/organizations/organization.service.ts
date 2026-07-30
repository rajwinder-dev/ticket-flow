import { permissions } from '@org/constants';
import { CreateOrganizationInput } from '@org/zod';
import { addDays } from 'date-fns';
import { env } from '../../config/env.js';
import { appError } from '../../core/utils/appError.js';
import { readableId } from '../../core/utils/utils.js';
import { ActivityService } from '../activity/activity.service.js';
import { TokenService } from '../token/token.service.js';
import { getTenantClient, prisma } from '@org/database';
import { NotificationService } from '../notification/notification.service.js';

export class OrganizationService {
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
  static inviteMember = async (
    userId: string,
    input: { organizationId: string; roleId: string; email: string },
  ) => {
    const { organizationId, email, roleId } = input;
    const tenentDb = getTenantClient(organizationId);
    const user = await tenentDb.membership.findUnique({
      where: {
        organizationId_userId: {
          userId,
          organizationId,
        },
      },
      select: {
        organization: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!user) throw new appError('Owner Details not found', 404, 'NOT_FOUND');
    const { token, id } = await TokenService.createToken({
      input: {
        email,
        type: 'INVITE_USER',
        organizationId,
        roleId,
        createdBy: userId,
      },
      expiresAt: addDays(new Date(), 7),
    });
    const url = `${env.betterAuthUrl}/invite-user/${token}`;
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: 'USER',
      message: 'created invite link to join organization',
      event: 'organization.invite',
      entityId: id,
      entityType: 'ORGANIZATION',
    });
    return { url };
  };
  static acceptInvite = async (
    userId: string,
    email: string,
    token: string,
  ) => {
    const verifyToken = await TokenService.verifyToken(token);
    if (!verifyToken?.organizationId || !verifyToken?.roleId)
      throw new appError(
        'Invite Link is Invalid or Expire',
        400,
        'INVALID_TOKEN',
      );
    if (verifyToken?.email !== email)
      throw new appError(
        'Invite not applicable for your Email',
        403,
        'FORBIDDEN',
      );
    const tenentDb = getTenantClient(verifyToken.organizationId);
    const data = await tenentDb.membership.create({
      data: {
        userId,
        organizationId: verifyToken.organizationId,
        roleId: verifyToken.roleId,
      },
      include: {
        organization: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    await TokenService.updateTokenStatus(token, 'USED');
    await ActivityService.lagActivity({
      organizationId: data.organizationId,
      actorId: userId,
      actorType: 'USER',
      message: 'user joined organization',
      event: 'organization.join',
      entityId: data.id,
      entityType: 'ORGANIZATION',
      metadata: {
        memberShipId: data.id,
        roleId: data.roleId,
      },
    });
    const orgOwner = await tenentDb.membership.findFirst({
      where: {
        organizationId: data.organizationId,
        role: {
          isSystem: true,
          name: 'OWNER',
        },
      },
    });
    if (orgOwner?.userId)
      NotificationService.sendNotification({
        recipientId: orgOwner?.userId,
        userId: null,
        data: {
          organizationId: data.organizationId,
          channel: 'IN_APP',
          title: 'User acept the Invite',
          message: `User ${email} accepted the invite`,
          type: 'MEMBER',
          actorId: userId,
        },
      });
    return { organizationId: data.organizationId };
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
