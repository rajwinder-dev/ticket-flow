import { render } from "@react-email/render";
import { CreateEmailProviderInput } from "@repo/schemas";
import { ProviderType } from "../../../generated/prisma";
import { decrypt, encrypt, EncryptionType } from "../../core/utils/crypto";
import { prisma } from "../../core/utils/prismaClient";
import { EmailConfigService } from "./email-config.service";
import { sendEmailService } from "./email.types";
import { emailProviderFactory } from "./providers/provider.factory";
export class EmailService {
  static sendEmail = async ({ organizationId, to, subject, jsx }: sendEmailService) => {
    //  fetch the config
    const providerInfo = await EmailConfigService.getEmailCredentials(organizationId);
    const credentials = JSON.parse(decrypt(providerInfo?.credentials as EncryptionType));
    const provider = emailProviderFactory(providerInfo.providerType, credentials);
    const html = await render(jsx);
    // render template

    return await provider.sendMail({ to, from: providerInfo.from, subject, html });
    // send mail
  };
  static createEmailProvider = async (
    organizationId: string,
    userEmail: string,
    { credentials, providerType, from }: CreateEmailProviderInput,
  ) => {
    const encryptCredentials = encrypt(JSON.stringify(credentials));
    await this.verifyProvider(userEmail, providerType, credentials);
    return await prisma.emailProvider.create({
      data: {
        organizationId,
        credentials: encryptCredentials,
        providerType,
        from,
      },
    });
  };
  static updateEmailProvider = async (
    id: string,
    userEmail: string,
    organizationId: string,
    { credentials, providerType, from }: CreateEmailProviderInput,
  ) => {
    const encryptCredentials = encrypt(JSON.stringify(credentials));
    await this.verifyProvider(userEmail, providerType, credentials);
    return await prisma.emailProvider.update({
      where: {
        id,
        organizationId,
        providerType,
        from,
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
}
