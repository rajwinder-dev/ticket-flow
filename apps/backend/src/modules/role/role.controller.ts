import { CreateRoleInput, UpdateRoleInput } from "@repo/schemas";
import { Prisma } from "../../../generated/prisma";
import { catchAsync } from "../../core/utils/catchAsync";
import HandleFactory from "../../core/utils/handlerFactory";
import { prisma } from "../../core/utils/prismaClient";
import response from "../../core/utils/response";
import { RoleService } from "./role.service";

export class roleController {
  private static handler = new HandleFactory<Prisma.RoleUncheckedCreateInput>(prisma.role);

  static createRole = catchAsync(async (req, res, _next) => {
    const input = req.body as CreateRoleInput;
    const data = await RoleService.create(req.user.id, req.organization.id, input);
    response(res, data, 201);
  });
  static getRoleDetails = catchAsync(async (req, res, _next) => {
    const id = req.user.id as string;
    const data = await this.handler.getOne(id);
    response(res, data, 200);
  });
  static getAllRoles = catchAsync(async (req, res, _next) => {
    const { data, pagination } = await this.handler.getAll(req.query, {
      where: {
        organizationId: req.organization.id,
        active: true,
        name: {
          not: "OWNER",
        }
      },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        permissions: true,
      },
    });

    response(res, data, 200, { otherFields: { ...pagination } });
  });
  static updateRole = catchAsync(async (req, res, _next) => {
    const input = req.body as UpdateRoleInput;
    const roleId = req.params.id as string;
    const data = await RoleService.update({
      roleId,
      input,
      organizationId: req.organization.id,
      userId: req.user.id,
    });
    response(res, data);
  });
  static deleteRole = catchAsync(async (req, res, _next) => {
    const roleId = req.params.id as string;
    const data = await RoleService.delete({
      roleId,
      organizationId: req.organization.id,
      userId: req.user.id,
    });
    response(res, data, 201);
  });
}
