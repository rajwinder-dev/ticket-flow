import { faker } from '@faker-js/faker';
import { log } from '@org/utils';

import { prisma } from '@org/database';
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
      avatar: faker.image.avatar(),
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
        avatar: faker.image.avatar(),
      },
    });
  }

  const createdUsers = await prisma.user.findMany();

  for (const user of createdUsers) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneNo: faker.phone.number(),
        location: faker.location.streetAddress(),
        avatar: faker.image.avatar(),
      },
    });
  }
  log.success(`Created ${createdUsers.length} users`);
  return createdUsers;
}
