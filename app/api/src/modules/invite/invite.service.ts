import { getTenantClient } from '@org/database';
import { appError } from '../../core/utils/appError';
import { TokenService } from '../token/token.service';
import { addDays } from 'date-fns';
import { env } from '../../config/env';
import { ActivityService } from '../activity/activity.service';
import { EmailService } from '../email/email.service';
import { NotificationService } from '../notification/notification.service';

class InviteServiceClass {
  inviteMember = async ({
    actor,
    input,
  }: {
    actor: {
      userId: string;
      email: string;
      username: string;
      organizationName: string;
    };
    input: { organizationId: string; roleId: string; email: string };
  }) => {
    const { organizationId, email, roleId } = input;
    if (email === actor.email)
      throw new appError('self invite is not applicable', 403, 'FORBIDDEN');

    const tenentDb = getTenantClient(organizationId);
    const user = await tenentDb.membership.findUnique({
      where: {
        organizationId_userId: {
          userId: actor.userId,
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
        createdBy: actor.userId,
      },
      expiresAt: addDays(new Date(), 7),
    });
    const url = `${env.betterAuthUrl}/invite-user/${token}`;
    await ActivityService.lagActivity({
      organizationId,
      actorId: actor.userId,
      actorType: 'USER',
      message: 'created invite link to join organization',
      event: 'organization.invite',
      entityId: id,
      entityType: 'ORGANIZATION',
    });
    await EmailService.queueEmail({
      organizationId,
      to: email,
      subject: 'Invite Email to our organizations',
      template: 'invite',
      data: {
        invitedByUsername: actor.username,
        organization: actor.organizationName,
        inviteLink: url,
      },
      isSystemEmail: false,
    });

    return { url };
  };
  acceptInvite = async (userId: string, email: string, token: string) => {
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
  getInviteDetails = async (token: string) => {
    const verifyToken = await TokenService.verifyToken(token);
    if (!verifyToken?.organizationId || !verifyToken?.roleId)
      throw new appError(
        'Invite Link is Invalid or Expire',
        400,
        'INVALID_TOKEN',
      );
    const tenantdb = getTenantClient(verifyToken.organizationId);
    const inviteData = await tenantdb.token.findFirst({
      where: {
        token,
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
        TokenCreatedBy: {
          select: {
            email: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!inviteData) throw new appError('Invite not found', 404, 'NOT_FOUND');
    const data = {
      organization: inviteData?.organization?.name,
      role: inviteData?.role?.name,
      invitedTo: inviteData?.email,
      invitedBy: inviteData?.TokenCreatedBy?.email,
      expiresAt: inviteData?.expiresAt,
    };
    return data;
  };
}

export const InviteService = new InviteServiceClass();
