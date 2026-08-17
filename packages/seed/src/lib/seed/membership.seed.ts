import { log } from '@org/utils';
import { prisma } from '@org/database';
import { User } from '@org/database';
import { progress } from '../seed.helper.js';
import { prismSeed } from '../prismaSeedClient.js';

export async function seedMembers({
  users,
  membershipCount = 20,
}: {
  users: User[];
  membershipCount: number;
}) {
  log.info(`creating membership of ${users.length} users as ${membershipCount} per org`);

  const organizations = await prisma.organization.findMany();

  for (const [index, org] of organizations.entries()) {
    const roles = await prismSeed.role.findMany({
      where: { organizationId: org.id },
    });

    if (!roles || roles.length === 0) {
      continue;
    }

    const orgRoles = roles.filter((role) => role.name !== 'OWNER');
    if (orgRoles.length === 0) {
      continue;
    }

    const memberCount = Math.floor(Math.random() * membershipCount) + 1;
    const members = users.sort(() => 0.5 - Math.random()).slice(0, memberCount);
    const membershipData = members.map((member) => {
      const randomRole = orgRoles[Math.floor(Math.random() * orgRoles.length)];
      return {
        userId: member.id,
        organizationId: org.id,
        roleId: randomRole.id,
      };
    });

    try {
      await prismSeed.membership.createMany({
        data: membershipData,
        skipDuplicates: true,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error(`Error batch-adding members to org ${org.id}:`, message);
    }
    progress(organizations.length, index);
  }

  log.success('org members seeded successfully');
}
