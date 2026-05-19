import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/client.js";
import { env } from "../../config/env.js";
const connectionString = env.databaseURL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const clientCache = new Map<string, ReturnType<typeof createTenantClient>>();

function createTenantClient(organizationId: string) {
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
const getTenantClient = (organizationId: string) => {
  if (!clientCache.has(organizationId)) {
    // Validate UUID here if needed before caching
    clientCache.set(organizationId, createTenantClient(organizationId));
  }
  return clientCache.get(organizationId)!;
};
export { prisma, getTenantClient };
