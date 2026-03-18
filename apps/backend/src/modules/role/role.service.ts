import { CreateRoleInput, updateRoleInput } from "@repo/schemas";
import { appError } from "../../core/utils/appError";
import { prisma } from "../../core/utils/prismaClient";
import { readableId } from "../../core/utils/utils";

export class RoleService {
  static create = async (userId: string, organizationId: string, input: CreateRoleInput) => {
    return await prisma.role.create({
      data: {
        ...input,
        code: readableId("ROL"),
        organizationId,
        createdBy: userId,
      },
    });
  };
  static update = async (roleId: string, input: updateRoleInput) => {
    return await prisma.role.update({
      data: {
        ...input,
      },
      where: {
        id: roleId,
      },
    });
  };
  static delete = async (roleId: string) => {
    const userCount = await prisma.user.count({
      where: {
        roleId,
      },
    });
    if (userCount > 0)
      throw new appError("users are already assigned to this role", 409, "CONFLICT_ERROR");
    const role = prisma.role.update({
      data: {
        active: false,
      },
      where: {
        id: roleId,
      },
    });
    return role;
  };
}
