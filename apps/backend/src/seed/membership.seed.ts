import { User } from "../../generated/prisma";
import { log } from "../core/helper/log";
import { prisma } from "../core/utils/prismaClient";

export async function seedMembers(users: User[]) {
  log.info(`creating membership of ${users.length} users`);
  const organizations = await prisma.organization.findMany({
    include: {
      role: true,
    },
  });

  for (const org of organizations) {
    if (!org.role || org.role.length === 0) {
      continue;
    }
    const memberCount = Math.floor(Math.random() * 20) + 1;
    const members = users
      .sort(() => 0.5 - Math.random()) // Shuffle users
      .slice(0, memberCount); // Take random subset

    for (const member of members) {
      try {
        const randomRole = org.role[Math.floor(Math.random() * org.role.length)];
        await prisma.membership.create({
          data: {
            userId: member.id,
            organizationId: org.id,
            roleId: randomRole.id,
          },
        });
      } catch (err) {
        console.error(`Error adding ${member.email} to org:`, err.message);
      }
    }
  }
  log.success("org members seeded successfully");
}
