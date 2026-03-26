import { CreateCustomerInput, UpdateCustomerInput } from "@repo/schemas";
import { APIFeatures } from "../../core/utils/apiFeatures";
import { catchAsync } from "../../core/utils/catchAsync";
import { prisma } from "../../core/utils/prismaClient";
import response from "../../core/utils/response";

export class CustomerController {
  static getAllCustomers = catchAsync(async (req, res, _next) => {
    const organizationId = req.organization.id;
    const { filterOptions, limit, offset } = new APIFeatures(req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const customer = await prisma.customer.findMany({
      where: {
        organizationId,
        ...filterOptions.where,
      },
      include: {
        identity: {
          select: {
            email: true,
          },
        },
      },
      skip: offset,
      take: limit,
      orderBy: filterOptions.orderBy,
    });
    response(res, customer, 200);
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
