import { log } from "../src/core/helper/log";
import { prisma } from "../src/core/utils/prismaClient";
import { seedMembers } from "../src/seed/membership.seed";
import { seedOrganizations } from "../src/seed/organization.seed";
import { seedUsers } from "../src/seed/users.seed";
import { seedQueueGroups } from "../src/seed/queue.seed";
export class seedData {
  static async updateFakeData() {
    await this.clearData();
    const users = await seedUsers();
    log.success("Users seeded successfully");
    await seedOrganizations(users.splice(0, 10));
    log.success("organization seeded successfully");
    await seedMembers(users.splice(11, 50));
    log.success("org members seeded successfully");
    await seedQueueGroups();
    log.success("queue groups and queues seeded successfully");
  }
  static async createOnlyAdmin() {
    console.log("not done");
  }

  static async clearData() {
    await prisma.$queryRaw`TRUNCATE TABLE "User" CASCADE;`;
  }
}
const args = process.argv.slice(2);
async function main() {
  if (args.includes("--clear")) {
    return seedData.clearData();
  }
  if (args.includes("--admin")) {
    return seedData.createOnlyAdmin();
  }
  return seedData.updateFakeData();
}

// * run main script
main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
