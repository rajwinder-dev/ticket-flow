import { log } from "../src/core/helper/log";
import { prisma } from "../src/core/utils/prismaClient";
import { seedAgents } from "../src/seed/agent.seed";
import { seedMembers } from "../src/seed/membership.seed";
import { seedOrganizations } from "../src/seed/organization.seed";
import { seedQueueGroups } from "../src/seed/queue.seed";
import { seedUsers } from "../src/seed/users.seed";
const seedConfig = {
  usersCount: 100,
  ownersCount: 20,
  maxOrg: 3,
  maxGroupsPerOrg: 3,
  maxQueuePerGroup: 4,
};
export class seedData {
  static async updateFakeData() {
    await this.clearData();
    const users = await seedUsers(seedConfig.usersCount);
    await seedOrganizations(users.splice(0, seedConfig.ownersCount), seedConfig.maxOrg);
    await seedMembers(users.splice(seedConfig.ownersCount + 1, seedConfig.usersCount));
    await seedQueueGroups(seedConfig.maxGroupsPerOrg, seedConfig.maxQueuePerGroup);
    await seedAgents();
    log.success("agents seeded successfully");
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
