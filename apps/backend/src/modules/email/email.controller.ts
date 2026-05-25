import { CreateEmailProviderInput, CreateSmtpInput, emailProviderSchema } from "@repo/schemas";
import { appError } from "../../core/utils/appError.js";
import { catchAsync } from "../../core/utils/catchAsync.js";
import { prisma } from "../../core/utils/prismaClient.js";
import response from "../../core/utils/response.js";
import { EmailService } from "./email.service.js";
import { ResendService } from "./providers/resend.service.js";
import z from "zod";
import { disptachEmail } from "../../core/utils/emailQueue.js";

export class EmailController {
  static createProvider = catchAsync(async (req, res, _next) => {
    const input = req.body as CreateEmailProviderInput;
    await EmailService.createEmailProvider(req.organization.id, {
      ...input,
      priority: 1,
    });
    response(res, { message: "Email Provider added successfully" }, 201);
  });
  static createSMTP = catchAsync(async (req, res, _next) => {
    const input = req.body as CreateSmtpInput;
    await EmailService.createEmailProvider(req.organization.id, {
      ...input,
      providerType: "SMTP",
      priority: 2,
    });
    response(res, { message: "SMTP Provider added successfully" }, 201);
  });
  static getProviders = catchAsync(async (req, res, _next) => {
    const data = await EmailService.getEmailProviders(req.organization.id);
    response(res, data, 200, { schema: z.array(emailProviderSchema) });
  });
  static updateCredentials = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    const input = req.body as CreateEmailProviderInput;
    await EmailService.updateEmailProvider(id, req.user.email, req.organization.id, input);
    response(res, { message: "Email Provider updated successfully" }, 200);
  });
  static deleteCredentials = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    const organizationId = req.organization.id;
    await EmailService.deleteEmailProvider(id, organizationId);
    response(res, null, 204);
  });
  static webHook = catchAsync(async (req, res, _next) => {
    const organizationId = req.params.orgId as string;
    const data = await prisma.emailProvider.findFirst({
      where: { organizationId, providerType: { not: "SMTP" } },
    });
    if (!data?.webhookSecret) throw new appError("webhookSecret not found ", 404, "NOT_FOUND");
    // logic for resend
    if (req?.headers["svix-id"]) {
      const input = {
        payload: req.body.toString(),
        headers: {
          "svix-id": req.headers["svix-id"] as string,
          "svix-timestamp": req.headers["svix-timestamp"] as string,
          "svix-signature": req.headers["svix-signature"] as string,
        },
      };
      ResendService.verifyWebhook(req.body.toString(), data?.webhookSecret, input.headers);
      console.log(input.payload);
    }
    response(res, null, 200);
  });
  static testEmail = catchAsync(async (req, res, _next) => {
    await disptachEmail({
      jobType: "email",
      to: "test@gmail.com",
      subject: "this is test email",
      organizationId: "test-id",
      template: "welcome",
      data: {
        userFirstName: "test",
      },
    });
    // await EmailService.sendEmail({
    //   organizationId: req.organization.id,
    //   to: req.user.email,
    //   subject: "this is test email",
    //   jsx: WelcomeEmail({ userFirstName: "rajwinder" }),
    // });

    response(res, { data: "email sent success" }, 200);
  });
}
