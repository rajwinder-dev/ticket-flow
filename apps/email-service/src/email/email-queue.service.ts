import { render } from "@react-email/render";
import { decrypt } from "../crypto.js";
import { providerData, sendEmailService, sendSystemEmailService } from "./email-queue.types.js";
import { cryptoType } from "@repo/schemas";
import { emailProviderFactory } from "@repo/email-providers";
export class EmailQueueService {
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

    return await provider.sendMail({ to, from: process.env.EMAIL, subject, html });
  };

  static sendEmailLogic = async (
    emailProvider: providerData,
    { to, subject, html }: { to: string; subject: string; html: string },
  ) => {
    const verifiedCredentials = cryptoType.safeParse(emailProvider.credentials);
    if (!verifiedCredentials.success) throw new Error("Invalid credentials");
    const credentials = JSON.parse(decrypt(verifiedCredentials.data));
    const provider = emailProviderFactory(emailProvider.providerType, credentials);

    return await provider.sendMail({ to, from: emailProvider.fromEmail, subject, html });
  };
}
