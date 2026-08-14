import { ResentEmailWebhookSchema } from '@org/zod';
import { appError } from '../../core/utils/appError.js';
import { catchAsync } from '../../core/utils/catchAsync.js';
import response from '../../core/utils/response.js';
import { TicketService } from '../ticket/ticket/ticket.service.js';
import { ResendWebhookService } from './resendWebhooks.service.js';
import { crypto } from '../../core/utils/crypto.js';
import { EncryptionType } from '@org/utils';
import { ResendConfig } from '@org/email-providers';
import { parseJson } from '../../core/helper/generalHelper.js';
const SUPPORTED_EVENTS = ['email.received'];
import senitizeHtml from 'sanitize-html';
export class resendWebhookController {
  static events = catchAsync(async (req, res, _next) => {
    const rawBody = req.body.toString('utf8');
    const headers = {
      'svix-id': req.headers['svix-id'] as string,
      'svix-timestamp': req.headers['svix-timestamp'] as string,
      'svix-signature': req.headers['svix-signature'] as string,
    };
    const payload = parseJson<ResentEmailWebhookSchema>(rawBody);

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
    // decrypt credentials
    const credentialString = crypto.decrypt(
      provider.credentials as EncryptionType,
    );
    const credentials = parseJson<ResendConfig>(credentialString);

    // fetch sender details
    const { emailData } = await ResendWebhookService.fetchSenderDetails({
      credentials,
      email_id: payload.data.email_id,
    });
    // get owner
    const ownerData = await ResendWebhookService.getOwnerDetails(
      provider?.organizationId,
    );
    // handle event
    if (payload?.type === 'email.received') {
      await TicketService.createAndAssign({
        organizationId: provider.organizationId,
        ownerId: ownerData?.userId,
        input: {
          subject: payload.data.subject || 'No subject',
          email: payload.data.from,
          description: senitizeHtml(emailData.html || emailData.text || ''),
          priority: 'MEDIUM',
          category: 'GENERAL',
        },
      });
      return response(res, 'Ticket Created Success', 200);
    }
    return response(res, null, 200);
  });
}
