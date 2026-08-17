import { log } from '@org/utils';
import {  prisma } from '@org/database';
import { progress } from '../seed.helper.js';
import { prismSeed } from '../prismaSeedClient.js';

export async function seedAgents() {
  log.info(`seeding agents to unique queues.`);
  const organizations = await prisma.organization.findMany();

  for (const [current, org] of organizations.entries()) {

    const membership = await prismSeed.membership.findMany({
      where: { role: { name: { not: 'OWNER' } }, organizationId: org.id },
    });
    const queueGroups = await prismSeed.queueGroup.findMany({
      where: { organizationId: org.id },
      include: { queues: true },
    });

    const agentIds = membership.map((m) => m.userId);
    const allQueues = queueGroups.flatMap((group) => group.queues);

    if (agentIds.length === 0 || allQueues.length === 0) continue;

    // Build every queueAgent row up front instead of one create() per agent.
    const queueAgentData = agentIds.map((agentId, index) => ({
      organizationId: org.id,
      queueId: allQueues[index % allQueues.length].id,
      agentId,
    }));

    try {
       await prismSeed.queueAgent.createMany({
        data: queueAgentData,
        skipDuplicates: true,
      });
    } catch (error) {
      console.error(
        `Batch insert failed for org ${org.id}. Check if 'agentId' should be the User ID or Membership ID.`,
        error,
      );
      throw error;
    }

    progress(organizations.length, current);
  }
}
