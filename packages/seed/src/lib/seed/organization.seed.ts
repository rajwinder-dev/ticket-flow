import { permissions } from "@org/constants";
import { log } from "@org/utils";
import { Organization, User, getTenantClient, prisma } from "@org/database";
import { faker } from "@faker-js/faker";

export async function seedOrganizations(owners: User[], maxOrganizationCount: number) {
  log.info(`seeding Max ${maxOrganizationCount} organization for ${owners.length}`);
  const orgData  = [];
  for (const owner of owners) {
    const orgCount = Math.floor(Math.random() * maxOrganizationCount) + 1;

    for (let i = 0; i < orgCount; i++) {
      const name = `${owner.email.split("@")[0]}'s Corp ${i + 1}`;
      try {
        const organizationData = await prisma.organization.create({
          data: {
            name,
            code: generateCode("ORG"),
            createdBy: owner.id,
            teamSize: Math.floor(Math.random() * 100) + 1,
            description: `Organization number ${i + 1} for ${owner.email}`,
            slug: name.replace(/\s+/g, "-").toLowerCase(),
            logo: faker.image.avatar(),
            type: "TEAM",
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
    { name: "OWNER", permissions: permissions }, // Full access
    { name: "ADMIN", permissions: filterPermissions(permissions, ["delete"]) }, // No delete
    { name: "SUPPORT", permissions: filterPermissions(permissions, ["delete", "edit", "create"]) }, // View only mostly
  ];

  for (const roleDef of roleDefinitions) {
    const tenantDb = getTenantClient(org.id);
    try {
      const role = await tenantDb.role.create({
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
        await tenantDb.membership.create({
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
function filterPermissions(allPerms: typeof permissions, restrictedActions: string[]) {
  const newPerms = JSON.parse(JSON.stringify(allPerms)); // Deep clone
  for (const category in newPerms) {
    newPerms[category] = newPerms[category].filter(
      (action: string) => !restrictedActions.some((restricted) => action.includes(restricted)),
    );
  }
  return newPerms;
}
