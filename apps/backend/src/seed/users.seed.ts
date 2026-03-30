import { faker } from "@faker-js/faker";
import { Prisma } from "../../generated/prisma";
import { log } from "../core/helper/log";
import { prisma } from "../core/utils/prismaClient";
import { readableId } from "../core/utils/utils";
import { BcryptService } from "../modules/auth/bcrypt.service";

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
      code: readableId("USR"),
      phoneNo: faker.phone.number(),
      passwordHash: "", // temp placeholder
    });
  }
  const hashedUsers = await Promise.all(
    users.map(async (user) => ({
      ...user,
      passwordHash: await BcryptService.hashPassword("123456"),
    })),
  );
  const createdUsers = await prisma.user.createManyAndReturn({
    data: hashedUsers,
  });
  log.success(`Created ${createdUsers.length} users`);
  return createdUsers;
}
