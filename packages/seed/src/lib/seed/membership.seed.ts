import { log } from '@org/utils';
import { getTenantClient, prisma } from '@org/database';
import { User } from '@org/database';

export async function seedMembers(users: User[]) {
  log.info(`creating membership of ${users.length} users`);
  const organizations = await prisma.organization.findMany();

  for (const org of organizations) {
    const tenantDb = getTenantClient(org.id);
    const roles = await tenantDb.role.findMany();
    if (!roles || roles.length === 0) {
      continue;
    }
    const memberCount = Math.floor(Math.random() * 20) + 1;
    const members = users
      .sort(() => 0.5 - Math.random()) // Shuffle users
      .slice(0, memberCount); // Take random subset

    for (const member of members) {
      const orgRoles = roles.filter((role) => role.name !== 'OWNER');
      try {
        const randomRole =
          orgRoles[Math.floor(Math.random() * orgRoles.length)];
        await tenantDb.membership.create({
          data: {
            userId: member.id,
            organizationId: org.id,
            roleId: randomRole.id,
          },
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred';

        console.error(`Error adding ${member.email} to org:`, message);
      }
    }
  }
  log.success('org members seeded successfully');
}
