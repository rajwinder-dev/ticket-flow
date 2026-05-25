import { EmailQueueInput, UpdateEmailProviderInput } from "@repo/schemas";
import { appError } from "../../core/utils/appError.js";
import { encrypt } from "../../core/utils/crypto.js";
import { prisma, ProviderType } from "@repo/database";
import { emailQueuePush } from "../../core/utils/emailQueue.js";
export class EmailService {
  static queueEmail = async ({
    organizationId,
    to,
    subject,
    template,
    data,
    isSystemEmail,
  }: Omit<EmailQueueInput, "jobType">) => {
    return await emailQueuePush({
      organizationId,
      to,
      subject,
      template,
      data,
      jobType: "email",
      isSystemEmail,
    });
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
    // await this.verifyProvider(userEmail, providerType, credentials);
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
    { credentials, providerType, fromEmail }: UpdateEmailProviderInput,
  ) => {
    const encryptCredentials = encrypt(JSON.stringify(credentials));
    console.log(id, organizationId);
    return await prisma.emailProvider.update({
      where: {
        id,
        organizationId,
      },
      data: {
        domain: fromEmail.split("@")[1],
        fromEmail,
        providerType,
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
}
