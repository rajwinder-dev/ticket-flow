import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../../generated/client.js";
import { env } from "../../config/env.js";
const connectionString = env.databaseURL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
function forTenant(organizationId: string) {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query }) {
            const [, result] = await prisma.$transaction([
              prisma.$executeRaw`
                SELECT set_config(
                  'app.current_organization',
                  ${organizationId},
                  TRUE
                )
              `,
              query(args),
            ]);

            return result;
          },
        },
      },
    }),
  );
}

const getTenantClient = (organizationId: string) => prisma.$extends(forTenant(organizationId));
export { prisma, forTenant, getTenantClient };
