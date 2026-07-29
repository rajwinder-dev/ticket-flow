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

function ticketCode(orgIndex: number, i: number): string {
  return `TCK-${orgIndex + 1}-${String(i + 1).padStart(4, '0')}`;
}

export async function seedTickets() {
  const organizations = await prisma.organization.findMany();

  for (const [orgIndex, org] of organizations.entries()) {
    const tenantDb = getTenantClient(org.id);

    const [queues, customers, users] = await Promise.all([
      tenantDb.queue.findMany({ where: { organizationId: org.id } }),
      tenantDb.customer.findMany({ where: { organizationId: org.id } }),
      tenantDb.user.findMany({
        where: { membership: { some: { organizationId: org.id } } },
      }),
    ]);

    if (!customers.length || !users.length) {
      console.warn(`Skipping org ${org.id}: missing customers or users`);
      continue;
    }

    let tickets = [];

    for (let i = 0; i < TICKETS_PER_ORG; i++) {
      const customer = randomItem(customers);
      const assignedToUser = randomItem(users);
      const assignedByUser = randomItem(users);
      const queue = queues.length ? randomItem(queues) : undefined;

      tickets.push({
        code: ticketCode(orgIndex, i),
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
    }

    // Ticket creation runs through the tenant-scoped client so the
    // `app.current_organization` session var (used by RLS policies)
    // is set for every query issued here.
    await tenantDb.ticket.createMany({
      data: tickets,
      skipDuplicates: true,
    });
    // fix assigment count
    log.info('updating open assignment count per agent');
    const data = await tenantDb.ticket.groupBy({
      where: {
        status: 'OPEN',
      },
      by: ['assignedTo'],
      _count: {
        assignedTo: true,
      },
    });
    for (const d of data) {
      if (d.assignedTo)
        await tenantDb.queueAgent.updateMany({
          where: {
            agentId: d.assignedTo,
          },
          data: {
            ticketCount: d._count.assignedTo,
          },
        });
    }
    console.log(`Seeded ${tickets.length} tickets for org ${org.id}`);
  }
}
