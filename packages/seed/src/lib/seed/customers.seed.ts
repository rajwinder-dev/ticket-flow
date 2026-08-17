import { faker } from '@faker-js/faker';
import { log } from '@org/utils';
import { prisma } from '@org/database';
import { progress } from '../seed.helper.js';
import { prismSeed } from '../prismaSeedClient.js';

export async function seedCustomers(maxCustomersPerOrganization: number = 25) {
  const organizations = await prisma.organization.findMany({
    select: { id: true, name: true },
  });

  if (organizations.length === 0) {
    log.info('No organizations found, skipping customer seeding.');
    return [];
  }

  log.info(
    `Seeding max ${maxCustomersPerOrganization} customers per organization`,
  );
  const createdCustomerIds: string[] = [];

  for (const [orgIndex, organization] of organizations.entries()) {
    const customerCount = Math.max(
      1,
      Math.floor(Math.random() * maxCustomersPerOrganization),
    );

    // 1. Generate fake people, deduping emails within this org's batch.
    const seenEmails = new Set<string>();
    const people: {
      email: string;
      name: string;
      phone: string;
      avatarUrl: string;
    }[] = [];

    while (people.length < customerCount) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName }).toLowerCase();
      if (seenEmails.has(email)) continue;
      seenEmails.add(email);
      people.push({
        email,
        name: `${firstName} ${lastName}`,
        phone: faker.phone.number(),
        avatarUrl: faker.image.avatar(),
      });
    }

    try {
      // 2. Batch insert customer identities, generating ids ourselves
      //    (createMany doesn't return rows, so we need ids in hand
      //    to link customers to them below).
      const identityRows = people.map((p) => ({
        id: crypto.randomUUID(), // adjust if your schema generates ids differently
        email: p.email,
      }));

      await prismSeed.customerIdentity.createMany({
        data: identityRows,
        skipDuplicates: true,
      });

      // 3. Fetch back real ids for these emails — needed because
      //    skipDuplicates means some emails may resolve to
      //    pre-existing identity rows rather than the ones we just made.
      const identities = await prismSeed.customerIdentity.findMany({
        where: { email: { in: people.map((p) => p.email) } },
        select: { id: true, email: true },
      });
      const emailToIdentityId = new Map(identities.map((i) => [i.email, i.id]));

      // 4. Batch insert customers, linked to their identity.
      const customerData = people
        .filter((p) => emailToIdentityId.has(p.email))
        .map((p) => ({
          organizationId: organization.id,
          identityId: emailToIdentityId.get(p.email)!,
          name: p.name,
          phone: p.phone,
          avatarUrl: p.avatarUrl,
          isActive: true,
        }));

      await prismSeed.customer.createMany({
        data: customerData,
        skipDuplicates: true,
      });

      // 5. Fetch back the created customer ids for the return value.
      const customers = await prismSeed.customer.findMany({
        where: {
          organizationId: organization.id,
          identityId: { in: Array.from(emailToIdentityId.values()) },
        },
        select: { id: true },
      });
      createdCustomerIds.push(...customers.map((c) => c.id));
    } catch (error) {
      console.error(
        `Failed to seed customers for organization ${organization.name}:`,
        error,
      );
    }

    progress(organizations.length, orgIndex + 1);
  }

  log.success(
    `Seeded ${createdCustomerIds.length} customers across all organizations.`,
  );
  return createdCustomerIds;
}
