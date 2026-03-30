import { IncomingEmail, incomingEmailSchema } from "@repo/schemas";
import express, { Router } from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { appError } from "../../core/utils/appError";
import { catchAsync } from "../../core/utils/catchAsync";
import { prisma } from "../../core/utils/prismaClient";
import response from "../../core/utils/response";
import { CustomerService } from "../customer/customer.service";
import { resendWebhookController } from "./resendWebhooks.controller";
const webhookRouter = Router();
webhookRouter.post("/resend", resendWebhookController.events);
webhookRouter.post(
  "/example",
  express.json(),
  validationMiddleware(incomingEmailSchema),
  catchAsync(async (req, res, _next) => {
    const { to, fromName, from, subject, textBody } = req.body as IncomingEmail;
    const organization = await prisma.emailProvider.findUnique({
      where: {
        from: to,
      },
    });
    console.log(organization);
    if (!organization) throw new appError("Organization not found ", 404, "NOT_FOUND");
    // create or update customer identity
    const data = await CustomerService.createCustomerIdentity(
      from,
      organization?.organizationId,
      fromName,
    );
    //  create a ticket for them message Id depended
    // const ticket = await TicketService.createTicket({
    //   organizationId: data.organizationId,
    //   subject,
    //   description: textBody,
    //   customerId: data.id
    // });

    response(res, null, 200);
  }),
);
export default webhookRouter;
