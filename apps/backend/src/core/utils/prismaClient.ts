import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../../generated/client.js";
import { env } from "../../config/env.js";
import z from "zod";
import { appError } from "./appError.js";
const connectionString = env.databaseURL;
console.log(connectionString);
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
function forTenant(organizationId: string) {
  const uuidSchema = z.uuid();

  // Validate
  const result = uuidSchema.safeParse(organizationId);

  if (!result.success) {
    throw new appError("Invalid organizationId", 400, "VALIDATION_ERROR");
  }
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query }) {
            console.log(args);
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
