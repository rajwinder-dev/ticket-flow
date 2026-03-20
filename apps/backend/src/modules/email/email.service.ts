import { render } from "@react-email/render";
import { CreateEmailProviderInput } from "@repo/schemas";
import { decrypt, encrypt, EncryptionType } from "../../core/utils/crypto";
import { prisma } from "../../core/utils/prismaClient";
import { EmailConfigService } from "./email-config.service";
import { sendEmailService } from "./email.types";
import { emailProviderFactory } from "./providers/provider.factory";
export class EmailService {
  static sendEmail = async ({ organizationId, from, to, subject, jsx }: sendEmailService) => {
    //  fetch the config
    const providerInfo = await EmailConfigService.getEmailCredentials(organizationId);
    const credentials = JSON.parse(decrypt(providerInfo?.credentials as EncryptionType));
    const provider = emailProviderFactory(providerInfo.providerType, credentials);
    const html = await render(jsx);
    // render template
    return await provider.sendMail({ to, from, subject, html });
    // send mail
  };
  static createEmailProvider = async (
    organizationId: string,
    { credentials, providerType }: CreateEmailProviderInput,
  ) => {
    const encryptCredentials = encrypt(JSON.stringify(credentials));

    return await prisma.emailProvider.create({
      data: {
        organizationId,
        credentials: encryptCredentials,
        providerType,
      },
    });
  };
  static updateEmailProvider = async (
    id: string,
    organizationId: string,
    { credentials, providerType }: CreateEmailProviderInput,
  ) => {
    const encryptCredentials = encrypt(JSON.stringify(credentials));

    return await prisma.emailProvider.update({
      where: {
        id,
        organizationId,
        providerType,
      },
      data: {
        credentials: encryptCredentials,
      },
    });
  };
}
