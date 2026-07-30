import { ResentEmailWebhookSchema } from '@org/zod';
import sanitizeHtml from 'sanitize-html';
import { appError } from '../../core/utils/appError.js';
import { catchAsync } from '../../core/utils/catchAsync.js';
import response from '../../core/utils/response.js';
import { ResendConfig, ResendService } from '@org/email-providers';
import { TicketService } from '../ticket/ticket.service.js';
import { crypto } from '../../core/utils/crypto.js';
import { EncryptionType } from '@org/utils';
import { getTenantClient } from '@org/database';

export class resendWebhookController {
  static events = catchAsync(async (req, res, _next) => {
    const tenantdb = getTenantClient(req.organization.id);
    const rawBody = req.body.toString('utf8');

    const headers = {
      'svix-id': req.headers['svix-id'] as string,
      'svix-timestamp': req.headers['svix-timestamp'] as string,
      'svix-signature': req.headers['svix-signature'] as string,
    };

    let tempPayload: ResentEmailWebhookSchema;
    try {
      tempPayload = JSON.parse(rawBody);
    } catch {
      throw new appError('Invalid JSON payload', 400, 'INVALID_JSON');
    }

    const email = tempPayload?.data;

    if (!email?.to) {
      throw new appError('Invalid payload structure', 400, 'INVALID_PAYLOAD');
    }

    // Lookup webhook secret
    const provider = await tenantdb.emailProvider.findFirst({
      where: {
        fromEmail: { in: email.to },
        providerType: { not: 'SMTP' },
      },
    });
    if (!provider?.webhookSecret) {
      throw new appError('webhookSecret not found', 404, 'NOT_FOUND');
    }

    try {
      await ResendService.verifyWebhook(
        rawBody,
        provider.webhookSecret,
        headers,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An unexpected error occurred';

      throw new appError(message, 400, 'INVALID_WEBHOOK');
    }
    const payload = JSON.parse(rawBody);
    const data = payload.data;

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

    const resend = new ResendService(credentials);
    const emailData = await resend.getEmailDetails(data.email_id);
    const safeHtml = emailData.html ? sanitizeHtml(emailData.html) : null;
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

    if (tempPayload?.type === 'email.received') {
      await TicketService.createAndAssign({
        organizationId: provider.organizationId,
        ownerId: ownerData?.userId || '',
        input: {
          subject: normalized.subject || 'No subject',
          email: normalized.from,
          description: safeHtml || emailData.text || '',
          priority: 'MEDIUM',
          category: 'GENERAL',
        },
      });
      return response(res, 'Ticket Created Success', 200);
    }
    return response(res, null, 200);
  });
}
