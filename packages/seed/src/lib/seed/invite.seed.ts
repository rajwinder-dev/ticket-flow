import { faker } from '@faker-js/faker';
import { prisma } from '@org/database';
import { createTokenHash, log } from '@org/utils';

const TOTAL_INVITES = 5;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function seedInvites() {
  log.info('seeding invites');

  const [orgOwners, roles] = await Promise.all([
    prisma.membership.findMany({
      where: { role: { name: 'OWNER' } },
    }),
    prisma.role.findMany({
      where: { NOT: { name: 'OWNER' } },
    }),
  ]);

  for (const member of orgOwners) {
    for (let i = 0; i < TOTAL_INVITES; i++) {
      const randomRole = roles[Math.floor(Math.random() * roles.length)];

      await prisma.token.create({
        data: {
          email: faker.internet.email(),
          organizationId: member.organizationId,
          type: 'INVITE_USER',
          roleId: randomRole.id,
          createdBy: member.userId,
          token: createTokenHash(),
          expiresAt: new Date(Date.now() + ONE_DAY_MS),
        },
      });
    }
  }

  log.success('invites seeded successfully');
}
