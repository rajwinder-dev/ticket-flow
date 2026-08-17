import { log } from '@org/utils';
import { Organization, QueueGroup, prisma } from '@org/database';
import { prismSeed } from '../prismaSeedClient.js';
import { progress } from '../seed.helper.js';

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

  for (const [current, org] of organizations.entries()) {
    const queueGroupCount = Math.floor(Math.random() * maxQueueGroups) + 2;

    // 1. Build queue group rows up front, generating ids ourselves
    //    (createMany doesn't return created rows, so we need ids in hand
    //    to build the queues that reference them).
    const queueGroups: QueueGroup[] = Array.from(
      { length: queueGroupCount },
      (_, i) =>
        ({
          id: crypto.randomUUID(), // adjust if your schema uses a different id strategy (e.g. cuid())
          name: `Queue Group ${i + 1} - ${org.name}`,
          organizationId: org.id,
          default: i === 0,
        }) as QueueGroup,
    );

    await prismSeed.queueGroup.createMany({
      data: queueGroups,
      skipDuplicates: true,
    });

    // 2. Build every queue row, across every group, in one flat array.
    const queues = queueGroups.flatMap((queueGroup) =>
      buildQueues(queueGroup, org, maxQueueCount),
    );

    // 3. Single batch insert for all queues in this org.
    await prismSeed.queue.createMany({
      data: queues,
      skipDuplicates: true,
    });
    progress(organizations.length, current);
  }

  log.success('queue groups and queues seeded successfully');
}

function buildQueues(
  queueGroup: QueueGroup,
  org: Organization,
  maxQueueCount: number,
) {
  const count = maxQueueCount - 1;
  const queueCount = Math.floor(Math.random() * count) + count;

  return Array.from({ length: queueCount }, (_, j) => ({
    name: `Queue ${j + 1} - ${queueGroup.name}`,
    organizationId: org.id,
    queueGroupId: queueGroup.id,
    order: j + 1,
  }));
}
