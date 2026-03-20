import {
  CreateOrganizationInput,
  InviteUserOrganizationInput,
  UpdateOrganizationInput,
} from "@repo/schemas";
import { addDays } from "date-fns";
import { Prisma } from "../../../generated/prisma";
import { env } from "../../config/env";
import { appError } from "../../core/utils/appError";
import { catchAsync } from "../../core/utils/catchAsync";
import HandleFactory from "../../core/utils/handlerFactory";
import { prisma } from "../../core/utils/prismaClient";
import response from "../../core/utils/response";
import { TokenService } from "../token/token.service";
import { OrganizationService } from "./organization.service";

export class OrganizationController {
  private static handler = new HandleFactory<Prisma.OrganizationUncheckedCreateInput>(
    prisma.organization,
  );
  static createOrganization = catchAsync(async (req, res) => {
    const input = req.body as CreateOrganizationInput;
    const data = await OrganizationService.create(req.user.id, input);
    response(res, data);
  });
  static getMyOrganizations = catchAsync(async (req, res) => {
    const membership = await prisma.membership.findMany({
      where: {
        userId: req.user.id,
      },
      select: {
        organization: {
          select: {
            name: true,
            id: true,
            createdBy: true,
          },
        },
      },
    });

    response(res, membership, 200);
  });
  static getOrganizationDetails = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const data = await this.handler.getOne(id);
    response(res, data, 200);
  });
  static updateOrganization = catchAsync(async (req, res) => {
    const input = req.body as UpdateOrganizationInput;
    const id = req.params.id as string;
    const data = await this.handler.update(id, input);
    response(res, data);
  });
  static deleteOrganization = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const data = await this.handler.softDelete(id);
    response(res, data);
  });
  static sendInvite = catchAsync(async (req, res, _next) => {
    const { email, roleId } = req.body as InviteUserOrganizationInput;
    if (email === req.user.email)
      throw new appError("self invite is not applicable", 403, "FORBIDDEN");
    const userId = req.user.id;
    const { token } = await TokenService.createToken({
      input: {
        email,
        type: "INVITE_USER",
        organizationId: req.organization.id,
        roleId,
        createdBy: userId,
      },
      expiresAt: addDays(new Date(), 7),
    });
    const url = `${env.coreURL}/invite-user/${token}`;
    console.log(url);
    response(res, { message: "Invite Sent successfully" });
  });
  static acceptInvite = catchAsync(async (req, res, _next) => {
    const token = req.params.token as string;
    const userId = req.user.id;

    const verifyToken = await TokenService.verifyToken(token);
    if (!verifyToken?.organizationId || !verifyToken?.roleId)
      throw new appError("Invite Link is Invalid or Expire", 400, "INVALID_TOKEN");
    if (verifyToken?.email !== req.user.email)
      throw new appError("Invite not applicable for your Email", 403, "FORBIDDEN");
    const membership = await prisma.membership.create({
      data: {
        userId,
        organizationId: verifyToken.organizationId,
        roleId: verifyToken.roleId,
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
      },
    });
    await TokenService.updateTokenStatus(token, "USED");
    response(res, membership, 200, {
      otherFields: { message: "Joined Organization successfully" },
    });
  });
  static InviteDetails = catchAsync(async (req, res, _next) => {
    const token = req.params.token as string;
    const verifyToken = await TokenService.verifyToken(token);
    if (!verifyToken?.organizationId || !verifyToken?.roleId)
      throw new appError("Invite Link is Invalid or Expire", 400, "INVALID_TOKEN");
    const inviteData = await prisma.token.findFirst({
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

    const data = {
      organization: inviteData?.organization?.name,
      role: inviteData?.role?.name,
      invitedTo: inviteData?.email,
      invitedBy: inviteData?.TokenCreatedBy?.email,
      expiresAt: inviteData?.expiresAt,
    };
    response(res, data, 200);
  });
}
