import { prisma } from "../src/core/utils/prismaClient";

export class seedData {
  static async updateFakeData() {
    console.log("not done");
  }
  static async createOnlyAdmin() {
    console.log("not done");
  }

  static async clearData() {
    await prisma.messaging.deleteMany();
    await prisma.participant.deleteMany();
    await prisma.chatRoom.deleteMany();
    await prisma.role.deleteMany();
    await prisma.notification.deleteMany();
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
