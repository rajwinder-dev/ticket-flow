import { log } from '@org/utils';
import { getTenantClient, prisma } from '@org/database';

export async function seedAgents() {
  log.info(`seeding agents to unique queues.`);

  // 1. Fetch organizations.
  const organizations = await prisma.organization.findMany({
    // where: {
    //   membership: {
    //     some: {
    //       role: {
    //         name: {
    //           not: 'OWNER',
    //         },
    //       },
    //     },
    //   },
    // },
    // include: {
    //   membership: {
    //     select: {
    //       id: true,
    //       userId: true,
    //     },
    //   },
    //   queueGroups: {
    //     include: {
    //       queues: { select: { id: true } },
    //     },
    //   },
    // },
  });

  // const queueAgentData: {
  //   organizationId: string;
  //   queueId: string;
  //   agentId: string;
  // }[] = [];

  for (const org of organizations) {
    const tenantDb = getTenantClient(org.id);
    const membership = await tenantDb.membership.findMany({
      where: { role: { name: { not: 'OWNER' } } },
    });
    const queueGroups = await tenantDb.queueGroup.findMany({
      include: { queues: true },
    });
    const agentIds = membership.map((m) => m.userId);
    const allQueues = queueGroups.flatMap((group) => group.queues);

    if (agentIds.length === 0 || allQueues.length === 0) continue;
    let index = 0;
    for (const agentId of agentIds) {
      const assignedQueue = allQueues[index % allQueues.length];
      try {
        await tenantDb.queueAgent.create({
          data: {
            organizationId: org.id,
            queueId: assignedQueue.id,
            agentId: agentId,
          },
        });
      } catch (error) {
        console.error(
          "Batch insert failed. Check if 'agentId' should be the User ID or Membership ID.",
        );
        throw error;
      }
      log.success(`Successfully assigned ${index} agents to unique queues.`);

      index++;
    }
  }
}
