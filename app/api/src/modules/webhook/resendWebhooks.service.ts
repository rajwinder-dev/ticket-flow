import sanitizeHtml from 'sanitize-html';
import { EmailWebhookRow } from './webhook.type';
import { getTenantClient, prisma } from '@org/database';
import { appError } from '../../core/utils/appError';
import { ResendConfig, ResendService } from '@org/email-providers';
import { EncryptionType } from '@org/utils';

import { crypto } from '../../core/utils/crypto.js';
class ResendWebhookServiceClass {
  fetchEmail = async ({
    payload,
    provider,
  }: {
    payload: {
      email_id: string;
      from: string;
      to: string[];
      subject: string;
      created_at: string;
      message_id: string;
    };
    provider: EmailWebhookRow;
  }) => {
    const tenantdb = getTenantClient(provider?.organizationId);
    const data = payload;
    // -------------------------------
    // Normalize email
    // -------------------------------
    const normalized = {
      from: data.from,
      to: data.to,
      subject: data.subject,
      createdAt: data.created_at,
      messageId: data.message_id,
    };
    // -------------------------------
    // Fetch email data
    // -------------------------------
    const credentialString = crypto.decrypt(
      provider.credentials as EncryptionType,
    );
    const credentials = JSON.parse(credentialString) as ResendConfig;
    const {safeHtml, emailData} = await this.fetchHTML({ credentials, email_id: data.email_id });
    const ownerData = await tenantdb.membership.findFirst({
      where: {
        organizationId: provider.organizationId,
        role: {
          name: 'OWNER',
        },
      },
      select: {
        userId: true,
      },
    });
    return { safeHtml, ownerData, normalized, emailData };
  };
  fetchHTML = async ({ credentials, email_id }: { credentials: ResendConfig, email_id: string }) => {
    const resend = new ResendService(credentials);
    const emailData = await resend.getEmailDetails(email_id);
    const safeHtml = emailData.html ? sanitizeHtml(emailData.html) : null;
    return { safeHtml , emailData};
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
