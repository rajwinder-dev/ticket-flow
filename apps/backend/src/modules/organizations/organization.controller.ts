import {
  CreateOrganizationInput,
  InviteUserOrganizationInput,
  UpdateOrganizationInput,
} from "@repo/schemas";
import { Prisma } from "../../../generated/prisma";
import { APIFeatures } from "../../core/utils/apiFeatures";
import { appError } from "../../core/utils/appError";
import { catchAsync } from "../../core/utils/catchAsync";
import HandleFactory from "../../core/utils/handlerFactory";
import { prisma } from "../../core/utils/prismaClient";
import response from "../../core/utils/response";
import InviteEmail from "../../templates/emails/InviteEmail";
import { EmailService } from "../email/email.service";
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
    const { filterOptions, limit, offset } = new APIFeatures(req.query).pagination();
    const total = await prisma.membership.count({
      where: {
        userId: req.user.id,
        ...filterOptions.where,
      },
    });
    const membership = await prisma.membership.findMany({
      where: {
        userId: req.user.id,
        ...filterOptions.where,
      },
      select: {
        organization: {
          select: {
            name: true,
            id: true,
            createdBy: true,
            logo: true,
          },
        },
      },
      take: limit,
      skip: offset,
    });
    const output = membership.map((m) => ({
      ...m.organization,
      isOwner: m.organization?.createdBy === req.user.id,
    }));
    response(res, output, 200, { otherFields: { limit, offset, total } });
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
    const { url } = await OrganizationService.inviteMember(req.user.id, {
      organizationId: req.organization.id,
      email,
      roleId,
    });
    await EmailService.sendEmail({
      organizationId: req.organization.id,
      to: email,
      subject: "Invite Email to our organizations",
      jsx: InviteEmail({
        invitedByUsername: req.user.username,
        organization: req.organization.name,
        inviteLink: url,
      }),
    });
    response(res, { message: "Invite Sent successfully" });
  });
  static acceptInvite = catchAsync(async (req, res, _next) => {
    const token = req.params.token as string;
    const verifyToken = await OrganizationService.acceptInvite(req.user.id, req.user.email, token);
    response(res, verifyToken, 200, {
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
