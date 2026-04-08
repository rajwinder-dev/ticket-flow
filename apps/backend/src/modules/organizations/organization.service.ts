import { CreateOrganizationInput } from "@repo/schemas";
import { addDays } from "date-fns";
import { env } from "../../config/env";
import { PERMISSIONS } from "../../config/permissions.config";
import { appError } from "../../core/utils/appError";
import { prisma } from "../../core/utils/prismaClient";
import { readableId } from "../../core/utils/utils";
import { ActivityService } from "../activity/activity.service";
import { TokenService } from "../token/token.service";

export class OrganizationService {
  static create = async (userId: string, input: CreateOrganizationInput) => {
    return await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          createdBy: userId,
          ...input,
          code: readableId("ORG"),
        },
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
        },
      });
      //  create role for member too
      const role = await tx.role.create({
        data: {
          name: "OWNER",
          code: readableId("ROL"),
          organizationId: organization.id,
          permissions: PERMISSIONS,
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
          isSystem: true
        },
      });
      await ActivityService.lagActivity({
        organizationId: organization.id,
        actorId: userId,
        actorType: "USER",
        message: "User created new organization ",
        event: "organization.create",
        entityId: organization.id,
        entityType: "ORGANIZATION",
      });
      return { organization, membership };
    });
  };
  static inviteMember = async (
    userId: string,
    input: { organizationId: string; roleId: string; email: string },
  ) => {
    const { organizationId, email, roleId } = input;

    const user = await prisma.membership.findUnique({
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
            username: true,
          },
        },
      },
    });
    if (!user) throw new appError("Owner Details not found", 404, "NOT_FOUND");
    const { token, id } = await TokenService.createToken({
      input: {
        email,
        type: "INVITE_USER",
        organizationId,
        roleId,
        createdBy: userId,
      },
      expiresAt: addDays(new Date(), 7),
    });
    const url = `${env.coreURL}/invite-user/${token}`;
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "created invite link to join organization",
      event: "organization.invite",
      entityId: id,
      entityType: "ORGANIZATION",
    });
    return { url };
  };
  static acceptInvite = async (userId: string, email: string, token: string) => {
    const verifyToken = await TokenService.verifyToken(token);
    if (!verifyToken?.organizationId || !verifyToken?.roleId)
      throw new appError("Invite Link is Invalid or Expire", 400, "INVALID_TOKEN");
    if (verifyToken?.email !== email)
      throw new appError("Invite not applicable for your Email", 403, "FORBIDDEN");
    const data = await prisma.membership.create({
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
    await TokenService.updateTokenStatus(token, "USED");
    await ActivityService.lagActivity({
      organizationId: data.organizationId,
      actorId: userId,
      actorType: "USER",
      message: "user joined organization",
      event: "organization.join",
      entityId: data.id,
      entityType: "ORGANIZATION",
      metadata: {
        memberShipId: data.id,
        roleId: data.roleId,
      },
    });
    return { organizationId: data.organizationId };
  };
}
