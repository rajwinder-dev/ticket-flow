import { prisma } from "../../core/utils/prismaClient";

export class CustomerService {
  static createCustomerIdentity = async (email: string, orgId: string, displayName?: string) => {
    const customerName = displayName || email.split("@")[0];
    return await prisma.customer.upsert({
      where: {
        organizationId_identityId: {
          organizationId: orgId,
          identityId: (
            await prisma.customerIdentity.upsert({
              where: { email },
              update: {},
              create: { email },
            })
          ).id,
        },
      },
      update: {}, // Update name or metadata if needed
      create: {
        organizationId: orgId,
        identityId: (await prisma.customerIdentity.findUnique({ where: { email } }))!.id,
        name: customerName,
      },
    });
  };
}
