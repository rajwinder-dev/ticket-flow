import { Organization, User } from "../../generated/prisma";
import { PERMISSIONS } from "../config/permissions.config";
import { log } from "../core/helper/log";
import { prisma } from "../core/utils/prismaClient";

/**
 * Seed random number of organizations (1-12) for each user
 */
export async function seedOrganizations(owners: User[], maxOrganizationCount: number) {
  log.info(`seeding Max ${maxOrganizationCount} organization for ${owners.length}`);
  const orgData: Organization[] = [];
  for (const owner of owners) {
    const orgCount = Math.floor(Math.random() * maxOrganizationCount) + 1;

    for (let i = 0; i < orgCount; i++) {
      try {
        const organizationData = await prisma.organization.create({
          data: {
            name: `${owner.email.split("@")[0]}'s Corp ${i + 1}`,
            code: generateCode("ORG"),
            createdBy: owner.id,
            teamSize: Math.floor(Math.random() * 100) + 1,
            description: `Organization number ${i + 1} for ${owner.email}`,
          },
        });
        orgData.push(organizationData);
        await seedRolesAndMembership(organizationData, owner.id);

        log.success(`Successfully created Org: ${organizationData.name}`);
      } catch (err) {
        console.error("Error creating org:", err);
      }
    }
  }
  return orgData;
}

/**
 * Seed multiple roles and assign the creator as the OWNER
 */
async function seedRolesAndMembership(org: Organization, userId: string) {
  const roleDefinitions = [
    { name: "OWNER", permissions: PERMISSIONS }, // Full access
    { name: "ADMIN", permissions: filterPermissions(PERMISSIONS, ["delete"]) }, // No delete
    { name: "SUPPORT", permissions: filterPermissions(PERMISSIONS, ["delete", "edit", "create"]) }, // View only mostly
  ];

  for (const roleDef of roleDefinitions) {
    try {
      const role = await prisma.role.create({
        data: {
          name: roleDef.name,
          code: generateCode("ROL"),
          organizationId: org.id,
          createdBy: userId,
          permissions: roleDef.permissions,
          isSystem: roleDef.name === "OWNER",
        },
      });

      // Assign the creator to the OWNER role specifically
      if (role.name === "OWNER") {
        await prisma.membership.create({
          data: {
            organizationId: org.id,
            userId: userId,
            roleId: role.id,
            isSystem: roleDef.name === "OWNER",
          },
        });
      }
    } catch (err) {
      console.error(`Error seeding role ${roleDef.name}:`, err);
    }
  }
}

/**
 * Utility: generate short random codes
 */
function generateCode(prefix: string) {
  return `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

/**
 * Utility: Simple permission filter to make roles look different
 */
function filterPermissions(allPerms: typeof PERMISSIONS, restrictedActions: string[]) {
  const newPerms = JSON.parse(JSON.stringify(allPerms)); // Deep clone
  for (const category in newPerms) {
    newPerms[category] = newPerms[category].filter(
      (action: string) => !restrictedActions.some((restricted) => action.includes(restricted)),
    );
  }
  return newPerms;
}
