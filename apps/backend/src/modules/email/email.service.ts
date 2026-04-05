import { render } from "@react-email/render";
import { CreateEmailProviderInput } from "@repo/schemas";
import { EmailProvider, ProviderType } from "../../../generated/prisma";
import { env } from "../../config/env";
import { appError } from "../../core/utils/appError";
import { decrypt, encrypt, EncryptionType } from "../../core/utils/crypto";
import { prisma } from "../../core/utils/prismaClient";
import { EmailConfigService } from "./email-config.service";
import { sendEmailService, sendSystemEmailService } from "./email.types";
import { emailProviderFactory } from "./providers/provider.factory";
export class EmailService {
  static sendEmail = async ({ organizationId, to, subject, jsx }: sendEmailService) => {
    const html = await render(jsx);
    const providers = await EmailConfigService.getEmailCredentials(organizationId);
    for (const provider of providers) {
      try {
        return await this.sendEmailLogic(provider, { to, subject, html });
      } catch (err) {
        console.error(`Provider ${provider.providerType} failed:`, err);
      }
    }
    throw new appError("All email providers failed", 500, "EMAIL_FAILED");
  };
  static sendSystemEmail = async ({ to, subject, jsx }: sendSystemEmailService) => {
    if (!env.email.providerType || !env.email.from)
      throw new appError("email credentials not defined in env", 404, "NOT_FOUND");
    const credentials = env.email;
    const provider = emailProviderFactory(env.email.providerType as ProviderType, credentials);
    const html = await render(jsx);
    // render template

    return await provider.sendMail({ to, from: env.email.from, subject, html });
  };
  static getEmailProviders = async (organizationId: string) => {
    const providers = await prisma.emailProvider.findMany({
      where: {
        organizationId,
      },
      select: {
        id: true,
        providerType: true,
        fromEmail: true,
        domain: true,
        priority: true,
      },
    });
    return providers;
  };
  static createEmailProvider = async (
    organizationId: string,
    userEmail: string,
    {
      credentials,
      providerType,
      fromEmail,
      webhookSecret,
      priority,
    }: {
      credentials: unknown;
      providerType: ProviderType;
      fromEmail: string;
      webhookSecret?: string;
      priority: number;
    },
  ) => {
    const existingProviderCount = await prisma.emailProvider.count({
      where: {
        organizationId,
      },
    });
    if (existingProviderCount === 2)
      throw new appError("Max 2 provider per organization is allowed", 400, "CONFLICT_ERROR");
    const encryptCredentials = encrypt(JSON.stringify(credentials));
    await this.verifyProvider(userEmail, providerType, credentials);
    return await prisma.emailProvider.create({
      data: {
        organizationId,
        credentials: encryptCredentials,
        priority,
        providerType,
        fromEmail,
        domain: fromEmail.split("@")[1],
        webhookSecret,
      },
    });
  };
  static updateEmailProvider = async (
    id: string,
    userEmail: string,
    organizationId: string,
    { credentials, providerType, fromEmail }: CreateEmailProviderInput,
  ) => {
    const encryptCredentials = encrypt(JSON.stringify(credentials));
    await this.verifyProvider(userEmail, providerType, credentials);
    return await prisma.emailProvider.update({
      where: {
        id,
        organizationId,
        providerType,
        fromEmail,
        domain: fromEmail.split("@")[1],
      },
      data: {
        credentials: encryptCredentials,
      },
    });
  };
  static deleteEmailProvider = async (id: string, organizationId: string) => {
    return await prisma.emailProvider.delete({
      where: {
        id,
        organizationId,
      },
    });
  };
  static verifyProvider = async (
    email: string,
    providerType: ProviderType,
    credentials: unknown,
  ) => {
    const provider = emailProviderFactory(providerType, credentials);
    return await provider.verify(email);
  };
  static sendEmailLogic = async (
    emailProvider: EmailProvider,
    { to, subject, html }: { to: string; subject: string; html: string },
  ) => {
    const credentials = JSON.parse(decrypt(emailProvider?.credentials as EncryptionType));
    const provider = emailProviderFactory(emailProvider.providerType, credentials);
    // render template
    return await provider.sendMail({ to, from: emailProvider.domain, subject, html });
  };
}
