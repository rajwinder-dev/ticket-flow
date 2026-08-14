import { EmailWebhookRow } from './webhook.type';
import { getTenantClient, prisma } from '@org/database';
import { appError } from '../../core/utils/appError';
import { ResendConfig, ResendService } from '@org/email-providers';

class ResendWebhookServiceClass {
  fetchSenderDetails = async ({
    credentials,
    email_id,
  }: {
    credentials: ResendConfig;
    email_id: string;
  }) => {
    const resend = new ResendService(credentials);
    const emailData = await resend.getEmailDetails(email_id);
    return { emailData };
  };
  getOwnerDetails = async (organizationId: string) => {
    const tenantdb = getTenantClient(organizationId);
    const ownerData = await tenantdb.membership.findFirst({
      where: {
        organizationId: organizationId,
        role: {
          name: 'OWNER',
        },
      },
      select: {
        userId: true,
      },
    });
    return ownerData;
  };
  verifyWebhook = async ({
    rawBody,
    headers,
    email,
  }: {
    rawBody: string;
    headers: {
      'svix-id': string;
      'svix-timestamp': string;
      'svix-signature': string;
    };
    email: string[];
  }) => {
    const rows = await prisma.$queryRaw<
      EmailWebhookRow[]
    >`SELECT * FROM get_email_webhook(${email}, 1)`;
    const provider = rows[0] ?? null;

    if (!provider?.webhookSecret) {
      throw new appError('webhookSecret not found', 404, 'NOT_FOUND');
    }
    try {
      await ResendService.verifyWebhook(
        rawBody,
        provider.webhookSecret,
        headers,
      );
      return { provider };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An unexpected error occurred';

      throw new appError(message, 400, 'INVALID_WEBHOOK');
    }
  };
}
export const ResendWebhookService = new ResendWebhookServiceClass();
