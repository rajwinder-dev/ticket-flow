import { log } from "../core/helper/log";
import { prisma } from "../core/utils/prismaClient";

export async function seedAgents() {
      log.info(`seeding agents to unique queues.`);

  // 1. Fetch organizations.
  const organizations = await prisma.organization.findMany({
    where: {
      membership: {
        some: {
          role: {
            name: {
              not: "OWNER"
            }
          }
        }
      }
    },
    include: {
      membership: {
        select: {
          id: true,
          userId: true
        }
      },
      queueGroups: {
        include: {
          queues: { select: { id: true } },
        },
      },
    },
  });

  const queueAgentData: { organizationId: string; queueId: string; agentId: string }[] = [];

  for (const org of organizations) {
    const agentIds = org.membership.map((m) => m.userId);
    const allQueues = org.queueGroups.flatMap((group) => group.queues);

    if (agentIds.length === 0 || allQueues.length === 0) continue;

    agentIds.forEach((agentId, index) => {
      const assignedQueue = allQueues[index % allQueues.length];
      queueAgentData.push({
        organizationId: org.id,
        queueId: assignedQueue.id,
        agentId: agentId,
      });
    });
  }

  if (queueAgentData.length > 0) {
    try {
      const result = await prisma.queueAgent.createMany({
        data: queueAgentData,
        skipDuplicates: true,
      });
      log.success(`Successfully assigned ${result.count} agents to unique queues.`);
    } catch (error) {
      console.error("Batch insert failed. Check if 'agentId' should be the User ID or Membership ID.");
      throw error;
    }
  }
}
