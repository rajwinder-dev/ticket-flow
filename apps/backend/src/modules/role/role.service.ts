import { CreateRoleInput, UpdateRoleInput } from "@repo/schemas";
import { appError } from "../../core/utils/appError.js";
import { prisma } from "../../core/utils/prismaClient.js";
import { readableId } from "../../core/utils/utils.js";
import { ActivityService } from "../activity/activity.service.js";

export class RoleService {
  static create = async (userId: string, organizationId: string, input: CreateRoleInput) => {
    const role = await prisma.role.create({
      data: {
        ...input,
        code: readableId("ROL"),
        organizationId,
        createdBy: userId,
      },
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "role is created ",
      event: "role.create",
      entityId: role.id,
      entityType: "ROLE",
    });
    return role;
  };
  static update = async ({
    roleId,
    organizationId,
    input,
    userId,
  }: {
    roleId: string;
    input: UpdateRoleInput;
    userId: string;
    organizationId: string;
  }) => {
    const existingRole = await prisma.role.findUnique({ where: { id: roleId } });
    const updatedRole = await prisma.role.update({
      data: input,
      where: {
        id: roleId,
        organizationId,
        isSystem: false,
      },
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "role is updated ",
      event: "role.update",
      entityId: roleId,
      oldData: existingRole,
      newData: updatedRole,
      entityType: "ROLE",
    });
    return updatedRole;
  };
  static delete = async ({
    roleId,
    organizationId,
    userId,
  }: {
    roleId: string;
    organizationId: string;
    userId: string;
  }) => {
    const existingRole = await prisma.role.findUnique({
      where: {
        id: roleId,
        isSystem: false
      },
      select: {
        active: true,
      },
    });
    if (!existingRole) throw new appError("Role not found ", 404, "NOT_FOUND");
    if (!existingRole.active) throw new appError("Role Already deleted", 409, "CONFLICT_ERROR");
    const userCount = await prisma.user.count({
      where: {
        id: roleId,
      },
    });
    if (userCount > 0)
      throw new appError("users are already assigned to this role", 409, "CONFLICT_ERROR");
    const updatedRole = prisma.role.update({
      data: {
        active: false,
      },
      where: {
        id: roleId,
        organizationId,
        isSystem: false
      },
    });
    await ActivityService.lagActivity({
      organizationId,
      actorId: userId,
      actorType: "USER",
      message: "role is updated ",
      event: "role.update",
      entityId: roleId,
      oldData: existingRole,
      newData: updatedRole,
      entityType: "ROLE",
    });
    return updatedRole;
  };
}
