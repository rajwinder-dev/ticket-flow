import { render } from "@react-email/render";
import { decrypt, EncryptionType } from "./../crypto.js";
import { providerData, sendEmailService, sendSystemEmailService } from "./email.types.js";
import { emailProviderFactory } from "./providers/provider.factory.js";
export class EmailService {
  static sendEmail = async ({ to, subject, jsx, providers }: sendEmailService) => {
    const html = await render(jsx);
    for (const provider of providers) {
      try {
        return await this.sendEmailLogic(provider, { to, subject, html });
      } catch (err) {
        console.error(`Provider ${provider.providerType} failed:`, err);
      }
    }
    throw new Error("All email providers failed");
  };
  static sendSystemEmail = async ({ to, subject, jsx }: sendSystemEmailService) => {
    if (!process.env.PROVIDER_TYPE || !process.env.EMAIL)
      throw new Error("email credentials not defined in env");
    const credentials = process.env.EMAIL;
    const provider = emailProviderFactory(process.env.PROVIDER_TYPE as "SMTP", credentials);
    const html = await render(jsx);
    // render template

    return await provider.sendMail({ to, from: process.env.EMAIL, subject, html });
  };

  static verifyProvider = async (
    email: string,
    providerType: "SMTP" | "RESEND",
    credentials: unknown,
  ) => {
    const provider = emailProviderFactory(providerType, credentials);
    return await provider.verify(email);
  };
  static sendEmailLogic = async (
    emailProvider: providerData,
    { to, subject, html }: { to: string; subject: string; html: string },
  ) => {
    const credentials = JSON.parse(decrypt(emailProvider?.credentials as EncryptionType));
    const provider = emailProviderFactory(emailProvider.providerType, credentials);
    // render template
    return await provider.sendMail({ to, from: emailProvider.fromEmail, subject, html });
  };
}
