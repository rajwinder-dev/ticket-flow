import { faker } from "@faker-js/faker";
import {log} from  "@org/utils"
import { prisma } from "@org/database";

export async function seedCustomers(maxCustomersPerOrganization: number = 25) {
  const organizations = await prisma.organization.findMany({
    select: { id: true, name: true },
  });

  if (organizations.length === 0) {
    log.info("No organizations found, skipping customer seeding.");
    return [];
  }

  log.info(`Seeding customers for ${organizations.length} organizations...`);

  const createdCustomerIds: string[] = [];

  for (const organization of organizations) {
    const customerCount = Math.max(1, Math.floor(Math.random() * maxCustomersPerOrganization));

    for (let i = 0; i < customerCount; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName }).toLowerCase();

      try {
        const customerIdentity = await prisma.customerIdentity.upsert({
          where: { email },
          update: {},
          create: { email },
        });

        const customer = await prisma.customer.upsert({
          where: {
            organizationId_identityId: {
              organizationId: organization.id,
              identityId: customerIdentity.id,
            },
          },
          update: {
            name: `${firstName} ${lastName}`,
            phone: faker.phone.number(),
            avatarUrl: faker.image.avatar(),
            isActive: true,
          },
          create: {
            organizationId: organization.id,
            identityId: customerIdentity.id,
            name: `${firstName} ${lastName}`,
            phone: faker.phone.number(),
            avatarUrl: faker.image.avatar(),
            isActive: true,
          },
        });

        createdCustomerIds.push(customer.id);
      } catch (error) {
        console.error(`Failed to seed customer for organization ${organization.name}:`, error);
      }
    }
  }

  log.success(`Seeded ${createdCustomerIds.length} customers across all organizations.`);
  return createdCustomerIds;
}
