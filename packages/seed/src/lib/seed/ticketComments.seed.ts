import { getTenantClient, prisma } from "@org/database";
import { faker } from "@faker-js/faker";

const COMMENTS_PER_TICKET_MIN = 1;
const COMMENTS_PER_TICKET_MAX = 8;

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



export async function seedTicketComments() {
  const organizations = await prisma.organization.findMany();

  for (const org of organizations) {
    const tenantDb = getTenantClient(org.id);

    const [tickets, users] = await Promise.all([
      tenantDb.ticket.findMany({ where: { organizationId: org.id } }),
      tenantDb.user.findMany(),
    ]);

    if (!tickets.length || !users.length) {
      console.warn(`Skipping org ${org.id}: missing tickets or users`);
      continue;
    }

    let comments = [];

    for (const ticket of tickets) {
      const commentCount = randomInt(COMMENTS_PER_TICKET_MIN, COMMENTS_PER_TICKET_MAX);

      for (let i = 0; i < commentCount; i++) {
        const author = randomItem(users);
        // Roughly a quarter of comments are internal-only notes
        const isInternal = Math.random() < 0.25;

        comments.push({
          ticketId: ticket.id,
          authorId: author.id,
          comment: isInternal
            ? `[Internal] ${faker.lorem.sentences({ min: 1, max: 2 })}`
            : faker.lorem.sentences({ min: 1, max: 3 }),
          isInternal,
          organizationId: org.id,
        });
      }
    }

    await tenantDb.ticketComment.createMany({
      data: comments,
      skipDuplicates: true,
    });

    console.log(`Seeded ${comments.length} ticket comments for org ${org.id}`);
  }
}
