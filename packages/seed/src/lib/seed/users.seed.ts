import { faker } from '@faker-js/faker';
import { log } from '@org/utils';

import { prisma,  } from '@org/database';
import { auth } from '@org/auth';

/**
 * Seed users
 */
export async function seedUsers(count: number = 50) {
  log.info(`Seeding ${count} users...`);

  const users: { email: string; name: string; password: string }[] = [];
  await auth.api.signUpEmail({
    body: {
      email: 'rajwindersxxx@gmail.com',
      name: 'Rajwinder',
      password: '8968585382',
    },
  });

  const emails = new Set<string>();

  while (users.length < count) {
    const email = faker.internet.email().toLocaleLowerCase();
    if (emails.has(email)) continue;
    users.push({
      email: faker.internet.email().toLocaleLowerCase(),
      password: faker.internet.email().toLocaleLowerCase(),
      name: faker.internet.userName(),
    });
  }

  for (const user of users) {
    await auth.api.signUpEmail({
      body: {
        email: user.email,
        password: user.email,
        name: user.name,
      },
    });
  }

  const createdUsers = await prisma.user.findMany();
  log.success(`Created ${createdUsers.length} users`);
  return createdUsers;
}
