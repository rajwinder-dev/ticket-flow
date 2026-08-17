import { prisma } from '@org/database';
import { faker } from '@faker-js/faker';
import { TicketAction, TicketStatus, Priority } from '@org/database';
import { log } from '@org/utils';
import { prismSeed } from '../prismaSeedClient.js';
import { progress } from '../seed.helper.js';

const TRANSITIONS_PER_TICKET_MIN = 1;

const STATUSES: TicketStatus[] = [
  TicketStatus.OPEN,
  TicketStatus.IN_PROGRESS,
  TicketStatus.ESCALATED,
  TicketStatus.ON_HOLD,
  TicketStatus.RESOLVED,
  TicketStatus.CLOSED,
  TicketStatus.REOPENED,
];

const PRIORITIES: Priority[] = [
  Priority.LOW,
  Priority.MEDIUM,
  Priority.HIGH,
  Priority.URGENT,
];

const ACTIONS: TicketAction[] = [
  TicketAction.ASSIGNED,
  TicketAction.ESCALATED,
  TicketAction.STATUS_CHANGED,
  TicketAction.PRIORITY_CHANGED,
  TicketAction.NOTE_ADDED,
];

const ESCALATION_REASONS = [
  'Customer requested manager review',
  'SLA breach imminent',
  'Requires specialist knowledge',
  'Repeated unresolved issue',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildActionFields(
  action: TicketAction,
  ctx: {
    users: { id: string }[];
    queues: { id: string }[];
    groups: { id: string }[];
  },
) {
  const { users, queues, groups } = ctx;

  switch (action) {
    case TicketAction.ASSIGNED: {
      const fromAgent = users.length ? randomItem(users) : undefined;
      const toAgent = users.length ? randomItem(users) : undefined;
      return {
        fromAgentId: fromAgent?.id,
        toAgentId: toAgent?.id,
      };
    }

    case TicketAction.ESCALATED: {
      const fromQueue = queues.length ? randomItem(queues) : undefined;
      const toQueue = queues.length ? randomItem(queues) : undefined;
      const fromGroup = groups.length ? randomItem(groups) : undefined;
      const toGroup = groups.length ? randomItem(groups) : undefined;
      return {
        fromQueueId: fromQueue?.id,
        toQueueId: toQueue?.id,
        fromGroupId: fromGroup?.id,
        toGroupId: toGroup?.id,
        escalationReason: randomItem(ESCALATION_REASONS),
      };
    }

    case TicketAction.STATUS_CHANGED: {
      return {
        fromStatus: randomItem(STATUSES),
        toStatus: randomItem(STATUSES),
      };
    }

    case TicketAction.PRIORITY_CHANGED: {
      return {
        fromPriority: randomItem(PRIORITIES),
        toPriority: randomItem(PRIORITIES),
      };
    }

    case TicketAction.NOTE_ADDED: {
      return {
        note: faker.lorem.sentences({ min: 1, max: 2 }),
      };
    }

    default:
      return {};
  }
}

export async function seedTicketTransitions({
  count = 8,
}: { count?: number } = {}) {
  log.info('seeding ticket transitions');
  const organizations = await prisma.organization.findMany();

  for (const [current, org] of organizations.entries()) {
    const [tickets, users, queues, groups] = await Promise.all([
      prismSeed.ticket.findMany({ where: { organizationId: org.id } }),
      prismSeed.user.findMany(),
      prismSeed.queue.findMany({ where: { organizationId: org.id } }),
      // Remove/adjust this if you don't have a QueueGroup model with
      // an organizationId field — it wasn't part of the shared schema.
      prismSeed.queueGroup.findMany({ where: { organizationId: org.id } }),
    ]);

    if (!tickets.length) {
      log.warn(`Skipping org ${org.id}: no tickets`);
      continue;
    }

    let transitions = [];

    for (const ticket of tickets) {
      const transitionCount = randomInt(TRANSITIONS_PER_TICKET_MIN, count);

      for (let i = 0; i < transitionCount; i++) {
        const action = randomItem(ACTIONS);
        const changedBy = users.length ? randomItem(users) : undefined;

        transitions.push({
          ticketId: ticket.id,
          action,
          organizationId: org.id,
          changedById: changedBy?.id,
          ...buildActionFields(action, { users, queues, groups }),
        });
      }
    }

    await prismSeed.ticketTransition.createMany({
      data: transitions,
      skipDuplicates: true,
    });
    progress(organizations.length, current);
  }
}
