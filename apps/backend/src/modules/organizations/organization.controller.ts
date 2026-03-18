import { CreateOrganizationInput, UpdateOrganizationInput } from "@repo/schemas";
import { Prisma } from "../../../generated/prisma";
import { catchAsync } from "../../core/utils/catchAsync";
import HandleFactory from "../../core/utils/handlerFactory";
import { prisma } from "../../core/utils/prismaClient";
import response from "../../core/utils/response";
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
  static InviteUser = catchAsync(async (req, res, _next) => {});
  static acceptInvite = catchAsync(async (req, res, _next) => {});
}
