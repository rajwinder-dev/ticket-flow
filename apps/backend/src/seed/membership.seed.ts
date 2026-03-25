import { User } from "../../generated/prisma";
import { prisma } from "../core/utils/prismaClient";

export async function seedMembers(users: User[]) {
  const organizations = await prisma.organization.findMany({
    include: {
      role: true,
    },
  });

  for (const org of organizations) {
    if (!org.role || org.role.length === 0) {
      console.warn(`Skipping Org ${org.id}: No roles found.`);
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
}
