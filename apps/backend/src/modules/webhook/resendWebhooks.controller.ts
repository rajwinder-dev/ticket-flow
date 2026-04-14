import { ResentEmailWebhookSchema } from "@repo/schemas";
import sanitizeHtml from "sanitize-html";
import { log } from "../../core/helper/log";
import { appError } from "../../core/utils/appError";
import { catchAsync } from "../../core/utils/catchAsync";
import { decrypt, EncryptionType } from "../../core/utils/crypto";
import { prisma } from "../../core/utils/prismaClient";
import response from "../../core/utils/response";
import { ResendConfig, ResendService } from "../email/providers/resend.service";
import { TicketService } from "../ticket/ticket.service";

export class resendWebhookController {
  static events = catchAsync(async (req, res, _next) => {
    const rawBody = req.body.toString("utf8");

    const headers = {
      "svix-id": req.headers["svix-id"] as string,
      "svix-timestamp": req.headers["svix-timestamp"] as string,
      "svix-signature": req.headers["svix-signature"] as string,
    };

    let tempPayload: ResentEmailWebhookSchema;
    try {
      tempPayload = JSON.parse(rawBody);
    } catch {
      throw new appError("Invalid JSON payload", 400, "INVALID_JSON");
    }

    const email = tempPayload?.data;

    if (!email?.to) {
      throw new appError("Invalid payload structure", 400, "INVALID_PAYLOAD");
    }

    // Lookup webhook secret
    const provider = await prisma.emailProvider.findFirst({
      where: {
        fromEmail: { in: email.to },
        providerType: { not: "SMTP" },
      },
    });

    if (!provider?.webhookSecret) {
      throw new appError("webhookSecret not found", 404, "NOT_FOUND");
    }

    try {
      await ResendService.verifyWebhook(rawBody, provider.webhookSecret, headers);
    } catch (error) {
      log.error(error);
      throw new appError("Invalid webhook signature", 400, "INVALID_WEBHOOK");
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
    const credentialString = decrypt(provider.credentials as EncryptionType);
    const credentials = JSON.parse(credentialString) as ResendConfig;

    const resend = new ResendService(credentials);
    const emailData = await resend.getEmailDetails(data.email_id);
    const safeHtml = emailData.html ? sanitizeHtml(emailData.html) : null;

    await TicketService.createAndAssign({
      organizationId: provider.organizationId,
      input: {
        subject: normalized.subject || "No subject",
        email: normalized.from,
        description: safeHtml || emailData.text || "",
        priority: "MEDIUM",
        category: "GENERAL",
      },
    });

    response(res, null, 200);
  });
}
