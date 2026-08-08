import { getTenantClient, prisma } from '@org/database';
import { ActivityService } from '../activity/activity.service.js';
import { CreateCustomerInput } from '@org/zod';

export class CustomerService {
  static createCustomerIdentity = async (
    email: string,
    organizationId: string,
    displayName?: string,
  ) => {
    const customerName = displayName || email.split('@')[0];
    const tenantDb = getTenantClient(organizationId);

    const identity = await prisma.customerIdentity.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    const customerData = await tenantDb.customer.upsert({
      where: {
        organizationId_identityId: {
          organizationId,
          identityId: identity.id,
        },
      },
      update: {}, // Update name or metadata if needed
      create: {
        organizationId,
        identityId: identity.id,
        name: customerName,
      },
    });
    if (customerData.createdAt === customerData.updatedAt) {
      await ActivityService.lagActivity({
        organizationId,
        actorType: 'SYSTEM',
        message: 'new customer is created ',
        event: 'customer.create',
        entityId: customerData.id,
        entityType: 'ORGANIZATION',
      });
    }
    return customerData;
  };
  static createCustomer = async ({
    data,
    organizationId,
  }: {
    data: CreateCustomerInput;
    organizationId: string;
  }) => {
    const tenantDb = getTenantClient(organizationId);
    const { email, name, phone, avatarUrl } = data;
    const customerIdentity = await tenantDb.customerIdentity.findUnique({
      where: { email },
      include: {
        customer: true,
      },
    });

    if (customerIdentity) {
      // Email already exists
      return await tenantDb.customer.create({
        data: {
          name,
          phone,
          avatarUrl,
          organizationId,
          identityId: customerIdentity.id,
        },
      });
    }
    return await tenantDb.customerIdentity.create({
      data: {
        email,
        customer: {
          create: {
            name,
            phone,
            avatarUrl,
            organizationId,
          },
        },
      },
      include: {
        customer: true,
      },
    });
  };
  static getCustomerByEmail = async ({
    email,
    organizationId,
  }: {
    email: string;
    organizationId: string;
  }) => {
    const tenantDb = getTenantClient(organizationId);
    const data = await tenantDb.customerIdentity.findUnique({
      where: {
        email,
      },
      include: {
        customer: true,
      },
    });
    return data?.customer;
  };
}
