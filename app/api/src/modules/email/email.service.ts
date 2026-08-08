import 'dotenv/config';
import { EmailQueueInput, UpdateEmailProviderInput } from '@org/zod';
import { appError } from '../../core/utils/appError.js';
import { getTenantClient, ProviderType } from '@org/database';
import { emailQueuePush } from '../../core/utils/emailQueue.js';
import { crypto } from '../../core/utils/crypto.js';
export class EmailService {
  static queueEmail = async ({
    organizationId,
    to,
    subject,
    template,
    data,
    isSystemEmail,
  }: Omit<EmailQueueInput, 'jobType'>) => {
    if (!isSystemEmail) {
      if (!organizationId) throw new appError('organizationId undefined', 404);
      const tenantdb = getTenantClient(organizationId);
      const emailProvider = await tenantdb.emailProvider.count({
        where: {
          organizationId,
        },
      });
      if (!emailProvider)
        throw new appError('You need to setup emailProvider', 404, 'NOT_FOUND');
    }
    return await emailQueuePush({
      organizationId,
      to,
      subject,
      template,
      data,
      jobType: 'email',
      isSystemEmail,
    });
  };

  static getEmailProviders = async (organizationId: string) => {
    const tenantdb = getTenantClient(organizationId);
    const providers = await tenantdb.emailProvider.findMany({
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
    const tenantdb = getTenantClient(organizationId);
    const existingProviderCount = await tenantdb.emailProvider.count({
      where: {
        organizationId,
      },
    });
    if (existingProviderCount >= 2)
      throw new appError(
        'Max 2 provider per organization is allowed',
        400,
        'CONFLICT_ERROR',
      );
    const encryptCredentials = crypto.encrypt(JSON.stringify(credentials));
    return await tenantdb.emailProvider.create({
      data: {
        organizationId,
        credentials: encryptCredentials,
        priority,
        providerType,
        fromEmail,
        domain: fromEmail.split('@')[1],
        webhookSecret,
      },
    });
  };
  static updateEmailProvider = async (
    id: string,
    organizationId: string,
    { credentials, providerType, fromEmail }: UpdateEmailProviderInput,
  ) => {
    const tenantdb = getTenantClient(organizationId);
    const encryptCredentials = crypto.encrypt(JSON.stringify(credentials));
    return await tenantdb.emailProvider.update({
      where: {
        id,
        organizationId,
      },
      data: {
        domain: fromEmail.split('@')[1],
        fromEmail,
        providerType,
        credentials: encryptCredentials,
      },
    });
  };
  static deleteEmailProvider = async (id: string, organizationId: string) => {
    const tenantdb = getTenantClient(organizationId);
    return await tenantdb.emailProvider.delete({
      where: {
        id,
        organizationId,
      },
    });
  };
}
