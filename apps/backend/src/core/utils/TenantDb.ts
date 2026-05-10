import { Prisma } from "../../generated/client.js";
import { prisma } from "./prismaClient.js";

export async function withTenantDB<T>(
  organizationId: string, // Corrected to lowercase 'string'
  callback: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  return prisma.$transaction(async (tx) => {
    // 1. Set the session variable
    await tx.$queryRaw`
    SELECT set_config(
      'app.current_organization',
      ${organizationId},
      true
    )
  `;

    const current = await tx.$queryRaw`
    SELECT  current_user
  `;

    console.log(current);
    // 2. Execute the business logic
    return callback(tx);
  });
}
