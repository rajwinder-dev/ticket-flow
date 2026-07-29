import { log } from '@org/utils';
import { Organization, QueueGroup, prisma } from '@org/database';

export async function seedQueueGroups(
  maxQueueGroups: number,
  maxQueueCount: number,
) {
  log.info(
    `seeding max ${maxQueueGroups} groups and max ${maxQueueCount} queues`,
  );

  const organizations = await prisma.organization.findMany({
    include: { user: true },
  });
  for (const org of organizations) {
    const queueGroupCount = Math.floor(Math.random() * maxQueueGroups) + 2;
    for (let i = 0; i < queueGroupCount; i++) {
      const queueGroup = await prisma.queueGroup.create({
        data: {
          name: `Queue Group ${i + 1} - ${org.name}`,
          organizationId: org.id,
          default: i === 0,
        },
      });
      await createQueue(queueGroup, org, maxQueueCount);
    }
  }
  log.success('queue groups and queues seeded successfully');
}
async function createQueue(
  queueGroup: QueueGroup,
  org: Organization,
  maxQueueCount: number,
) {
  const count = maxQueueCount - 1;
  const queueCount = Math.floor(Math.random() * count) + count;
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
