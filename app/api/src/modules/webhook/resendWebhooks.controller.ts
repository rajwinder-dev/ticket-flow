import { ResentEmailWebhookSchema } from '@org/zod';
import { appError } from '../../core/utils/appError.js';
import { catchAsync } from '../../core/utils/catchAsync.js';
import response from '../../core/utils/response.js';
import { TicketService } from '../ticket/ticket/ticket.service.js';
import { ResendWebhookService } from './resendWebhooks.service.js';
import { WebhookService } from './webhook.service.js';
const SUPPORTED_EVENTS = ['email.received'];
export class resendWebhookController {
  static events = catchAsync(async (req, res, _next) => {
    const { rawBody, headers } = {
      rawBody: req.body.toString('utf8'),
      headers: {
        'svix-id': req.headers['svix-id'] as string,
        'svix-timestamp': req.headers['svix-timestamp'] as string,
        'svix-signature': req.headers['svix-signature'] as string,
      },
    };
    const payload =
      WebhookService.parseRawData<ResentEmailWebhookSchema>(rawBody);

    if (!SUPPORTED_EVENTS.includes(payload.type)) {
      throw new appError(
        'Ignoring unsupported event',
        200,
        'UNSUPPORTED_EVENT',
      );
    }
    if (!payload.data?.to) {
      throw new appError('Invalid payload structure', 400, 'INVALID_PAYLOAD');
    }

    // verifyWebhook
    const { provider } = await ResendWebhookService.verifyWebhook({
      rawBody,
      headers,
      email: payload.data.to,
    });
    // fetch email data
    const { ownerData, safeHtml, normalized, emailData } =
      await ResendWebhookService.fetchEmail({
        payload: payload.data,
        provider,
      });
    // handle event
    if (payload?.type === 'email.received') {
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
