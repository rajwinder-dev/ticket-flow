import { CreateCustomerInput, customerSchemaResponse, UpdateCustomerInput } from "@repo/schemas";
import z from "zod";
import { APIFeatures } from "../../core/utils/apiFeatures.js";
import { catchAsync } from "../../core/utils/catchAsync.js";
import { prisma } from "../../core/utils/prismaClient.js";
import response from "../../core/utils/response.js";
import { normalize } from "../../core/utils/utils.js";

export class CustomerController {
  static getAllCustomers = catchAsync(async (req, res, _next) => {
    const organizationId = req.organization.id;
    const search = normalize(req.query.search);
    const { filterOptions, limit, offset } = new APIFeatures(req.query, { ignore: ["search"] })
      .filter()
      .sort()
      .pagination();
    const customers = await prisma.customer.findMany({
      where: {
        organizationId,
        ...filterOptions.where,
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            identity: {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      select: {
        name: true,
        phone: true,
        id: true,
        avatarUrl: true,
        identity: {
          select: {
            email: true,
          },
        },
        _count: {
          select: {
            tickets: true,
          },
        },
        tickets: {
          where: {
            status: "OPEN",
          },
          select: {
            id: true,
          },
        },
      },
      skip: offset,
      take: limit,
      orderBy: filterOptions.orderBy,
    });
    const total = await prisma.customer.count({
      where: {
        organizationId,
        ...filterOptions.where,
      },
    });
    // warn: not scalable yet
    const result = customers.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      avatarUrl: c.avatarUrl,
      email: c.identity.email,
      totalTickets: c._count.tickets,
      openTickets: c.tickets.length,
    }));
    response(res, result, 200, {
      otherFields: { limit, offset, total },
      schema: z.array(customerSchemaResponse),
    });
  });
  static createCustomer = catchAsync(async (req, res, _next) => {
    const organizationId = req.organization.id;
    const { name, email } = req.body as CreateCustomerInput;
    const customer = await prisma.customerIdentity.create({
      data: {
        email,
        customer: {
          create: {
            name,
            organizationId,
          },
        },
      },
    });
    response(res, customer, 201);
  });
  static updateCustomer = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    const input = req.body as UpdateCustomerInput;
    const organizationId = req.organization.id;
    const data = await prisma.customer.update({
      where: {
        id,
        organizationId,
      },
      data: input,
    });
    response(res, data, 200);
  });
}
