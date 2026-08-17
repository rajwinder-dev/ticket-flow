import { prisma } from '@org/database';
import { seedUsers } from './seed/users.seed.js';
import { seedOrganizations } from './seed/organization.seed.js';
import { seedMembers } from './seed/membership.seed.js';
import { seedQueueGroups } from './seed/queue.seed.js';
import { seedAgents } from './seed/agent.seed.js';
import { seedCustomers } from './seed/customers.seed.js';
import { seedTickets } from './seed/ticket.seed.js';
import { seedTicketComments } from './seed/ticketComments.seed.js';
import { seedTicketTransitions } from './seed/ticketTransitions.seed.js';
import { log } from '@org/utils';
import { seedInvites } from './seed/invite.seed.js';
import { seedEmailProviders } from './seed/emailProvider.seed.js';
import { seedActivityLog } from './seed/activityLog.seed.js';
import { generateSeedConfig } from './config.js';

const config = generateSeedConfig('medium');

export class seedData {
  static async updateFakeData() {
    await this.clearData();
    const users = await seedUsers({ count: config.USER_COUNT });
    await seedOrganizations({
      owners: users.splice(0, config.OWNER_COUNT),
    });
    await seedMembers({
      users: users.splice(config.OWNER_COUNT + 1, config.USER_COUNT),
      membershipCount: config.MEMBERS_COUNT,
    });
    await seedQueueGroups(config.GROUP_COUNT, config.QUEUES_COUNT);
    await seedAgents();
    await seedCustomers(config.CUSTOMER_COUNT);
    await seedTickets({ ticketCount: config.TICKET_COUNT });
    await seedTicketComments({ countPerTicket: config.COMMENT_COUNT });
    await seedTicketTransitions();
    await seedInvites();
    await seedEmailProviders();
    await seedActivityLog();
    log.success('Fake data seeded successfully');
  }
  static async createOnlyAdmin() {
    console.log('not done');
  }

  static async clearData() {
    await prisma.$queryRaw`TRUNCATE TABLE "user" CASCADE;`;
  }
}
const args = process.argv.slice(2);
async function main() {
  if (args.includes('--clear')) {
    return seedData.clearData();
  }
  if (args.includes('--admin')) {
    return seedData.createOnlyAdmin();
  }
  return seedData.updateFakeData();
}

// * run main script
main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
