import { CreateEmailProviderInput } from "@repo/schemas";
import { catchAsync } from "../../core/utils/catchAsync";
import response from "../../core/utils/response";
import Email from "../../templates/emails/Email";
import { EmailService } from "./email.service";

export class EmailController {
  static createProvider = catchAsync(async (req, res, _next) => {
    const input = req.body as CreateEmailProviderInput;
    await EmailService.createEmailProvider(req.organization.id, input);
    response(res, { message: "Email Provider added successfully" }, 201);
  });
  static updateCredentials = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    const input = req.body as CreateEmailProviderInput;
    await EmailService.updateEmailProvider(id, req.organization.id, input);
    response(res, { message: "Email Provider updated successfully" }, 200);
  });
  static testEmail = catchAsync(async (req, res, _next) => {
    await EmailService.sendEmail({
      organizationId: req.organization.id,
      from: "test@gmail.com",
      to: "rajwindersxxx@gmail.com",
      subject: "this is test email",
      jsx: Email(),
    });
    response(res, { data: "email send success" });
  });
}
