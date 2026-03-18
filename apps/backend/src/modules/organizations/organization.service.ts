import { CreateOrganizationInput } from "@repo/schemas";
import { PERMISSIONS } from "../../config/permissions.config";
import { prisma } from "../../core/utils/prismaClient";
import { readableId } from "../../core/utils/utils";

export class OrganizationService {
  static create = async (userId: string, input: CreateOrganizationInput) => {
    return await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          createdBy: userId,
          ...input,
          code: readableId("ORG"),
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
        },
      });
      // create membership
      const membership = await tx.membership.create({
        data: {
          organizationId: role.organizationId,
          userId,
          roleId: role.id,
        },
      });

      return { organization, membership };
    });
  };
}
