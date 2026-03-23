import { CreateEmailProviderInput } from "@repo/schemas";
import { catchAsync } from "../../core/utils/catchAsync";
import response from "../../core/utils/response";
import { WelcomeEmail } from "../../templates/emails/welcome";
import { EmailService } from "./email.service";

export class EmailController {
  static createProvider = catchAsync(async (req, res, _next) => {
    const input = req.body as CreateEmailProviderInput;
    await EmailService.createEmailProvider(req.organization.id, req.user.email, input);
    response(res, { message: "Email Provider added successfully" }, 201);
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
  static testEmail = catchAsync(async (req, res, _next) => {
    await EmailService.sendEmail({
      organizationId: req.organization.id,
      to: req.user.email,
      subject: "this is test email",
      jsx: WelcomeEmail({ userFirstname: "rajwinder" }),
    });
    response(res, { data: "email send success" });
  });
}
