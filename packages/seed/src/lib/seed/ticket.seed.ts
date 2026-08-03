import { getTenantClient, prisma } from '@org/database';
import { faker } from '@faker-js/faker';
import { TicketStatus, Priority } from '@org/database';
import { log } from '@org/utils';

const TICKETS_PER_ORG = 28;
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

export async function seedTickets() {
  log.info('seeding tickets');
  const organizations = await prisma.organization.findMany();

  for (const [orgIndex, org] of organizations.entries()) {
    const tenantDb = getTenantClient(org.id);
    const [groups, customers, users] = await Promise.all([
      tenantDb.queueGroup.findMany({ where: { organizationId: org.id } }),
      tenantDb.customer.findMany({ where: { organizationId: org.id } }),
      tenantDb.user.findMany({
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

    // Global counter so ticket codes stay unique across all groups in this org
    let ticketIndex = 0;

    for (let g = 0; g < groups.length; g++) {
      const queues = await tenantDb.queue.findMany({
        where: { queueGroupId: groups[g].id, organizationId: org.id },
      });

      for (let i = 0; i < TICKETS_PER_ORG; i++) {
        const customer = randomItem(customers);
        const assignedToUser = randomItem(users);
        const assignedByUser = randomItem(users);
        const queue = queues.length ? randomItem(queues) : undefined;

        await tenantDb.$transaction(async (tx) => {
          await tx.ticket.create({
            data: {
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
            },
          });

          if (queue?.id) {
            await tx.queueAgent.upsert({
              where: {
                queueId_agentId_organizationId: {
                  queueId: queue.id,
                  agentId: assignedToUser.id,
                  organizationId: org.id,
                },
              },
              update: {
                ticketCount: { increment: 1 },
              },
              create: {
                queueId: queue.id,
                agentId: assignedToUser.id,
                organizationId: org.id,
                ticketCount: 1,
              },
            });
          }
        });

        ticketIndex++;
      }

      log.success(
        `Seeded ${TICKETS_PER_ORG} tickets for group ${groups[g].id} in org ${org.id}`,
      );
    }
  }
}
