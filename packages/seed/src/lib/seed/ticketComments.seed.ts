import { prisma } from '@org/database';
import { faker } from '@faker-js/faker';
import { log } from '@org/utils';
import { progress } from '../seed.helper.js';
import { prismSeed } from '../prismaSeedClient.js';
import { TicketCommentUncheckedCreateInput } from '../../../../database/src/generated/models.js';

const COMMENTS_PER_TICKET_MIN = 1;

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type CommentRow = TicketCommentUncheckedCreateInput;

export async function seedTicketComments({
  countPerTicket = 10,
}: { countPerTicket?: number } = {}) {
  log.info(`seeding max ${countPerTicket} comments per ticket`);
  const organizations = await prisma.organization.findMany();

  for (const [current, org] of organizations.entries()) {
    const [tickets, users] = await Promise.all([
      prismSeed.ticket.findMany({ where: { organizationId: org.id } }),
      prismSeed.user.findMany({
        where: { membership: { some: { organizationId: org.id } } },
      }),
    ]);

    if (!tickets.length || !users.length) {
      log.warn(`Skipping org ${org.id}: missing tickets or users`);
      continue;
    }
    // crate multiple comments array stirng[]
   const comments = [];
    for (let i = 0; i < 10; i++) {
      comments.push(faker.lorem.sentences({ min: 1, max: 3 }));
    }
    const commentData: CommentRow[] = [];

    for (const ticket of tickets) {
      const commentCount = randomInt(COMMENTS_PER_TICKET_MIN, countPerTicket);
      for (let i = 0; i < commentCount; i++) {
        const author = randomItem(users);
        // Roughly a quarter of comments are internal-only notes
        const isInternal = Math.random() < 0.25;
        commentData.push({
          ticketId: ticket.id,
          authorId: author.id,
          comment: isInternal
            ? `[Internal] ${comments[Math.floor(Math.random() * comments.length)]}`
            : comments[Math.floor(Math.random() * comments.length)],
          isInternal,
          organizationId: org.id,
        });
      }
    }

    await prismSeed.ticketComment.createMany({
      data: commentData,
      skipDuplicates: true,
    });

    progress(organizations.length, current);
  }
}
