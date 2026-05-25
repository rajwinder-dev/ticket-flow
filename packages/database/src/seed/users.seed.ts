import { faker } from "@faker-js/faker";
import { log } from "@repo/utils";
import { prisma } from "../prismaClient.js";
import { Prisma } from "../generated/client.js";

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
    // users.push({
    //   email,
    //   code: "test",
    //   phoneNo: faker.phone.number(),
    //   username: faker.internet.userName(),
    //   passwordHash: "", // temp placeholder
    // });
  }

  const hashedUsers = await Promise.all(
    users.map(async (user) => {
      console.log();
      return {
        ...user,
        passwordHash: "password",
      };
    }),
  );

  const createdUsers = await prisma.user.createManyAndReturn({
    data: hashedUsers,
  });
  log.success(`Created ${createdUsers.length} users`);
  return createdUsers;
}
