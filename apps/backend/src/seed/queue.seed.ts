import { Organization, QueueGroup } from "../../generated/prisma";
import { prisma } from "../core/utils/prismaClient";

export async function seedQueueGroups() {
  const organizations = await prisma.organization.findMany({
    include: { user: true },
  });
  for (const org of organizations) {
    const queueGroupCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < queueGroupCount; i++) {
      const queueGroup = await prisma.queueGroup.create({
        data: {
          name: `Queue Group ${i + 1} - ${org.name}`,
          organizationId: org.id,
          default: i === 0,
        },
      });
      await createQueue(queueGroup, org);
    }
  }
}
async function createQueue(queueGroup: QueueGroup, org: Organization) {
  const queueCount = Math.floor(Math.random() * 3) + 3;
  for (let j = 0; j < queueCount; j++) {
    await prisma.queue.create({
      data: {
        name: `Queue ${j + 1} - ${queueGroup.name}`,
        organizationId: org.id,
        queueGroupId: queueGroup.id,
        order: j + 1,
      },
    });
  }
}
//   for each organization, create 2  to 4 queue groups randomly
