import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";
import { log } from "../core/helper/log.js";
import { prisma } from "../core/utils/prismaClient.js";
import { readableId } from "../core/utils/utils.js";
import { BcryptService } from "../modules/auth/bcrypt.service.js";

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
    console.log(email);
    users.push({
      email,
      code: readableId("USR"),
      phoneNo: faker.phone.number(),
      username: faker.internet.userName(),
      passwordHash: "", // temp placeholder
    });
  }

  const hashedUsers = await Promise.all(
    users.map(async (user) => {
      const passwordHash = await BcryptService.hashPassword("123456");
      console.log(passwordHash);
      return {
        ...user,
        passwordHash,
      };
    }),
  );

  const createdUsers = await prisma.user.createManyAndReturn({
    data: hashedUsers,
  });
  log.success(`Created ${createdUsers.length} users`);
  return createdUsers;
}

