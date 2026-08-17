import { faker } from '@faker-js/faker';
import { prisma } from '@org/database';
import { createTokenHash, log } from '@org/utils';
import { prismSeed } from '../prismaSeedClient.js';
import { progress } from '../seed.helper.js';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function seedInvites({ count = 5 }: { count?: number } = {}) {
  log.info('seeding invites');

  const organizations = await prisma.organization.findMany();

  // token lives on the global `prisma` client (not tenant-scoped), so we
  // can accumulate rows across every org and do a single createMany at
  // the very end instead of one per org.
  const inviteData: {
    email: string;
    organizationId: string;
    type: 'INVITE_USER';
    roleId: string;
    createdBy: string;
    token: string;
    expiresAt: Date;
  }[] = [];
  for (const [current, org] of organizations.entries()) {
    const [orgOwners, roles] = await Promise.all([
      prismSeed.membership.findMany({
        where: { role: { name: 'OWNER' }, organizationId: org.id },
      }),
      prismSeed.role.findMany({
        where: { NOT: { name: 'OWNER' }, organizationId: org.id },
      }),
    ]);

    if (!orgOwners.length || !roles.length) {
      log.warn(`Skipping org ${org.id}: missing owners or invitable roles`);
      continue;
    }

    for (const member of orgOwners) {
      for (let i = 0; i < count; i++) {
        const randomRole = roles[Math.floor(Math.random() * roles.length)];
        inviteData.push({
          email: faker.internet.email(),
          organizationId: member.organizationId,
          type: 'INVITE_USER',
          roleId: randomRole.id,
          createdBy: member.userId,
          token: createTokenHash(),
          expiresAt: new Date(Date.now() + ONE_DAY_MS),
        });
      }
    }
    progress(organizations.length, current);
  }

  await prisma.token.createMany({
    data: inviteData,
    skipDuplicates: true,
  });

  log.success(
    `Seeded ${inviteData.length} invites across ${organizations.length} organizations`,
  );
}
