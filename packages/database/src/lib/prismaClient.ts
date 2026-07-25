// packages/db/src/index.ts
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client.js';
import { log } from '@org/utils';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) log.error('connectionString is undefined');

const adapter = new PrismaPg({ connectionString });
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// name the extended type explicitly instead of letting it flow through ReturnType<>
type TenantClient = ReturnType<typeof createTenantClient>;
const clientCache = new Map<string, TenantClient>();

function createTenantClient(organizationId: string) {
  log.data('organizationId', organizationId);
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

export const getTenantClient = (organizationId: string): TenantClient => {
  if (!clientCache.has(organizationId)) {
    clientCache.set(organizationId, createTenantClient(organizationId));
  }
  return clientCache.get(organizationId)!;
};
