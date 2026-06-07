import { prisma } from "@repo/database";
import { ActivityService } from "../activity/activity.service.js";
import { CreateCustomerInput } from "@repo/schemas";

export class CustomerService {
  static createCustomerIdentity = async (
    email: string,
    organizationId: string,
    displayName?: string,
  ) => {
    const customerName = displayName || email.split("@")[0];
    const customerData = await prisma.customer.upsert({
      where: {
        organizationId_identityId: {
          organizationId,
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
        organizationId,
        identityId: (await prisma.customerIdentity.findUnique({ where: { email } }))!.id,
        name: customerName,
      },
    });
    if (customerData.createdAt === customerData.updatedAt) {
      await ActivityService.lagActivity({
        organizationId,
        actorType: "SYSTEM",
        message: "new customer is created ",
        event: "customer.create",
        entityId: customerData.id,
        entityType: "ORGANIZATION",
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
    const { email, name, phone, avatarUrl } = data;
    const customerIdentity = await prisma.customerIdentity.findUnique({
      where: { email },
      include: {
        customer: true,
      },
    });

    if (customerIdentity) {
      // Email already exists
      return await prisma.customer.create({
        data: {
          name,
          phone,
          avatarUrl,
          organizationId,
          identityId: customerIdentity.id,
        },
      });
    }
    return await prisma.customerIdentity.create({
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
  static getCustomerByEmail = async (email: string) => {
    const data = await prisma.customerIdentity.findUnique({
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
