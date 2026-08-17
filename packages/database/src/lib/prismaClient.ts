// packages/db/src/index.ts
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client.js';
import { log } from '@org/utils';
const connectionString = process.env.DATABASE_URL;
if (!connectionString) log.error('DATABASE_URL is undefined');

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({
  adapter,
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
  ],
});

// prisma.$on('query', (e) => {
//   console.log(e.query);
//   console.log(e.params);
// });

prisma.$on('error', (e) => {
  log.error(e.message);
  log.error(e.target);
});

export type TenantClient = ReturnType<typeof createTenantClient>;
const clientCache = new Map<string, TenantClient>();

function createTenantClient(organizationId: string) {
  if (!organizationId) throw new Error('organizationId teneant undefined');
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          const [, result] = await prisma.$transaction([
            prisma.$executeRaw`SELECT set_config('app.current_organization', ${organizationId}, true);`,
            query(args),
          ]);
          return result;
        },
      },
    },
  });
}

export const getTenantClient = (organizationId: string) => {
  if (!clientCache.has(organizationId)) {
    clientCache.set(organizationId, createTenantClient(organizationId));
  }
  return clientCache.get(organizationId)!;
};
export { PrismaClient, PrismaPg };
