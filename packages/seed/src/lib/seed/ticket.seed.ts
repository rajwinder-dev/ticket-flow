import { prisma } from '@org/database';
import { faker } from '@faker-js/faker';
import { TicketStatus, Priority } from '@org/database';
import { log } from '@org/utils';
import { prismSeed } from '../prismaSeedClient.js';
import { progress } from '../seed.helper.js';

const CATEGORIES = ['Billing', 'Technical', 'Account', 'General', 'Bug Report'];
const STATUSES: TicketStatus[] = [
  TicketStatus.OPEN,
  TicketStatus.IN_PROGRESS,
  TicketStatus.RESOLVED,
  TicketStatus.ON_HOLD,
  TicketStatus.CLOSED,
  TicketStatus.REOPENED,
];
const PRIORITIES: Priority[] = [
  Priority.LOW,
  Priority.MEDIUM,
  Priority.HIGH,
  Priority.URGENT,
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function ticketCode(orgIndex: number, ticketIndex: number): string {
  return `TCK-${orgIndex + 1}-${String(ticketIndex + 1).padStart(4, '0')}`;
}

export async function seedTickets({
  ticketCount = 100,
}: { ticketCount?: number } = {}) {
  log.info(`seeding max ${ticketCount} tickets per org`);
  const organizations = await prisma.organization.findMany();

  for (const [orgIndex, org] of organizations.entries()) {
    const [groups, customers, users] = await Promise.all([
      prismSeed.queueGroup.findMany({ where: { organizationId: org.id } }),
      prismSeed.customer.findMany({ where: { organizationId: org.id } }),
      prismSeed.user.findMany({
        where: { membership: { some: { organizationId: org.id } } },
      }),
    ]);

    if (!customers.length || !users.length) {
      log.data('data', { customers: customers.length, user: users.length });
      log.warn(`Skipping org ${org.id}: missing customers or users`);
      continue;
    }
    if (!groups.length) {
      continue;
    }

    let ticketIndex = 0;
    const ticketData = [];
    const queueAgentIncrements = new Map<
      string,
      {
        queueId: string;
        agentId: string;
        organizationId: string;
        count: number;
      }
    >();

    for (const group of groups) {
      const queues = await prismSeed.queue.findMany({
        where: { queueGroupId: group.id, organizationId: org.id },
      });

      for (let i = 0; i < ticketCount; i++) {
        const customer = randomItem(customers);
        const assignedToUser = randomItem(users);
        const assignedByUser = randomItem(users);
        const queue = queues.length ? randomItem(queues) : undefined;

        ticketData.push({
          code: ticketCode(orgIndex, ticketIndex),
          subject: faker.lorem.sentence({ min: 4, max: 8 }),
          category: randomItem(CATEGORIES),
          description: faker.lorem.paragraphs({ min: 1, max: 3 }),
          status: randomItem(STATUSES),
          priority: randomItem(PRIORITIES),
          active: true,
          organizationId: org.id,
          queueId: queue?.id,
          customerId: customer.id,
          assignedTo: assignedToUser.id,
          assignedBy: assignedByUser.id,
        });

        if (queue?.id) {
          const key = `${queue.id}:${assignedToUser.id}`;
          const existing = queueAgentIncrements.get(key);
          if (existing) {
            existing.count++;
          } else {
            queueAgentIncrements.set(key, {
              queueId: queue.id,
              agentId: assignedToUser.id,
              organizationId: org.id,
              count: 1,
            });
          }
        }

        ticketIndex++;
      }
    }

    await prismSeed.ticket.createMany({
      data: ticketData,
      skipDuplicates: true,
    });

    for (const inc of queueAgentIncrements.values()) {
      await prismSeed.queueAgent.upsert({
        where: {
          queueId_agentId_organizationId: {
            queueId: inc.queueId,
            agentId: inc.agentId,
            organizationId: inc.organizationId,
          },
        },
        update: {
          ticketCount: { increment: inc.count },
        },
        create: {
          queueId: inc.queueId,
          agentId: inc.agentId,
          organizationId: inc.organizationId,
          ticketCount: inc.count,
        },
      });
    }

    progress(organizations.length, orgIndex);
  }
}
