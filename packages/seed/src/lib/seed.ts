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
const seedConfig = {
  usersCount: 100,
  ownersCount: 20,
  maxOrg: 3,
  maxGroupsPerOrg: 3,
  maxQueuePerGroup: 4,
};
export class seedData {
  static async updateFakeData() {
    await this.clearData();
    const users = await seedUsers(seedConfig.usersCount);
    await seedOrganizations(
      users.splice(0, seedConfig.ownersCount),
      seedConfig.maxOrg,
    );
    await seedMembers(
      users.splice(seedConfig.ownersCount + 1, seedConfig.usersCount),
    );
    await seedQueueGroups(
      seedConfig.maxGroupsPerOrg,
      seedConfig.maxQueuePerGroup,
    );
    await seedAgents();
    await seedCustomers();
    await seedTickets();
    await seedTicketComments();
    await seedTicketTransitions();
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
