import { faker } from '@faker-js/faker';
import { log } from '@org/utils';
import { prisma } from '@org/database';
import { hashPassword } from '@org/auth';

const SEED_PASSWORD = '8968585382';
export async function seedUsers({ count = 50 }: { count: number }) {
  const current = await prisma.user.count();
  count = count - current;

  if(count <= 0) {
    log.info('No users to seed');
    return await prisma.user.findMany(); 
  }
  log.info(`Seeding ${count} users...`);
  const remaining = Math.max(count - 1, 0);
  const emails = new Set<string>();
  const fakeUsers: { email: string; name: string }[] = [
    {
      email: 'rajwindersxxx@gmail.com',
      name: 'Rajwinder',
    },
  ];

  while (fakeUsers.length < remaining) {
    const email = faker.internet.email().toLowerCase();
    if (emails.has(email)) continue;
    emails.add(email);
    fakeUsers.push({
      email,
      name: faker.internet.userName(),
    });
  }

  const sharedHashedPassword = await hashPassword(SEED_PASSWORD);

  await prisma.user.createMany({
    data: fakeUsers.map((u) => ({
      email: u.email,
      name: u.name,
      phoneNo: faker.phone.number(),
      location: faker.location.streetAddress(),
      avatar: faker.image.avatar(),
      emailVerified: true,
    })),
    skipDuplicates: true,
  });

  const createdUsers = await prisma.user.findMany({
    where: { email: { in: fakeUsers.map((u) => u.email) } },
  });

  await prisma.account.createMany({
    data: createdUsers.map((u) => ({
      id: crypto.randomUUID(),
      userId: u.id,
      providerId: 'credential',
      accountId: u.id,
      password: sharedHashedPassword,
    })),
    skipDuplicates: true,
  });

  log.success(
    `Created ${createdUsers.length} users (shared password: ${SEED_PASSWORD})`,
  );
  return createdUsers;
}
