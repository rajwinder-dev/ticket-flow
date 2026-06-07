import { faker } from "@faker-js/faker";
import { log } from "@repo/utils";
import { auth } from "../lib/auth.js";
import { prisma, Prisma } from "@repo/database";

/**
 * Seed users
 */
export async function seedUsers(count: number = 50) {
  log.info(`Seeding ${count} users...`);

  const users: Prisma.UserUncheckedCreateInput[] = [];

  const emails = new Set<string>();

  while (users.length < count) {
    const email = faker.internet.email().toLocaleLowerCase();
    if (emails.has(email)) continue;
    users.push({
      email,
      name: faker.internet.userName(),
    });
  }

   await Promise.all(
    users.map((user) =>
      auth.api.signUpEmail({
        body: {
          email: user.email,
          name: user.name, 
          password: "123456789",
          
        },
      }),
    ),
  );
  const userData = await prisma.user.findMany()
  log.success(`Created ${userData.length} users`);
  return userData;
}

