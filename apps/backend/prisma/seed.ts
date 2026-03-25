import { log } from "../src/core/helper/log";
import { prisma } from "../src/core/utils/prismaClient";
import { seedMembers } from "../src/seed/membership.seed";
import { seedOrganizations } from "../src/seed/organization.seed";
import { seedUsers } from "../src/seed/users.seed";
export class seedData {
  static async updateFakeData() {
    await this.clearData();
    const data = await seedUsers();
    log.success("Users seeded successfully");
    await seedOrganizations(data.splice(0, 10));
    log.success("organization seeded successfully");
    await seedMembers(data.splice(11, 50));
    log.success("org members seeded successfully");
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
