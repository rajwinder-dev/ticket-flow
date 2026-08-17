import { permissions } from '@org/constants';
import { log } from '@org/utils';
import { Organization, User, prisma } from '@org/database';
import { faker } from '@faker-js/faker';
import { progress } from '../seed.helper.js';
import { prismSeed } from '../prismaSeedClient.js';

export async function seedOrganizations({
  owners,
  count = 5,
}: {
  owners: User[];
  count?: number;
}) {
  log.info(`seeding Max ${count} organization for ${owners.length} users`);
  const orgData = [];
  for (const [index, owner] of owners.entries()) {
    const orgCount = Math.floor(Math.random() * count) + 1;

    for (let i = 0; i < orgCount; i++) {
      const name = `${owner.email.split('@')[0]}'s Corp ${i + 1}`;
      try {
        const organizationData = await prisma.organization.create({
          data: {
            name,
            code: generateCode('ORG'),
            createdBy: owner.id,
            teamSize: Math.floor(Math.random() * 100) + 1,
            description: `Organization number ${i + 1} for ${owner.email}`,
            slug: name.replace(/\s+/g, '-').toLowerCase(),
            logo: faker.image.avatar(),
            type: 'TEAM',
          },
        });
        orgData.push(organizationData);
        await seedRolesAndMembership(organizationData, owner.id);
      } catch (err) {
        console.error('Error creating org:', err);
      }
    }
    progress(owners.length, index + 1);
  }
  return orgData;
}

/**
 * Seed multiple roles and assign the creator as the OWNER
 */
async function seedRolesAndMembership(org: Organization, userId: string) {
  const roleDefinitions = [
    { name: 'OWNER', permissions: permissions }, // Full access
    { name: 'ADMIN', permissions: filterPermissions(permissions, ['delete']) }, // No delete
    {
      name: 'SUPPORT',
      permissions: filterPermissions(permissions, ['delete', 'edit', 'create']),
    }, // View only mostly
  ];

  for (const roleDef of roleDefinitions) {
    try {
      const role = await prismSeed.role.create({
        data: {
          name: roleDef.name,
          code: generateCode('ROL'),
          organizationId: org.id,
          createdBy: userId,
          permissions: roleDef.permissions,
          isSystem: roleDef.name === 'OWNER',
        },
      });

      // Assign the creator to the OWNER role specifically
      if (role.name === 'OWNER') {
        await prismSeed.membership.create({
          data: {
            organizationId: org.id,
            userId: userId,
            roleId: role.id,
            isSystem: roleDef.name === 'OWNER',
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
function filterPermissions(
  allPerms: typeof permissions,
  restrictedActions: string[],
) {
  const newPerms = JSON.parse(JSON.stringify(allPerms)); // Deep clone
  for (const category in newPerms) {
    newPerms[category] = newPerms[category].filter(
      (action: string) =>
        !restrictedActions.some((restricted) => action.includes(restricted)),
    );
  }
  return newPerms;
}
