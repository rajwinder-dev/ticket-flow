import { log } from "../../core/helper/log";
import { appError } from "../../core/utils/appError";
import { catchAsync } from "../../core/utils/catchAsync";
import { prisma } from "../../core/utils/prismaClient";
import response from "../../core/utils/response";
import { ResendService } from "../email/providers/resend.service";

export class resendWebhookController {
  static events = catchAsync(async (req, res, _next) => {
    const rawBody = req.body.toString("utf8"); // Buffer → string

    const headers = {
      "svix-id": req.headers["svix-id"] as string,
      "svix-timestamp": req.headers["svix-timestamp"] as string,
      "svix-signature": req.headers["svix-signature"] as string,
    };

    // temporary parse ONLY for lookup (risky but common pattern)
    const tempPayload = JSON.parse(rawBody);

    const data = await prisma.emailProvider.findFirst({
      where: {
        from: { in: tempPayload.data.to },
        providerType: { not: "SMTP" },
      },
    });

    if (!data?.webhookSecret) {
      throw new appError("webhookSecret not found", 404, "NOT_FOUND");
    }

    try {
      await ResendService.verifyWebhook(rawBody, data.webhookSecret, headers);
    } catch (error) {
      log.error(error);
      throw new appError("Invalid webhook signature", 400, "INVALID_WEBHOOK");
    }
    const payload = tempPayload;

    console.log(payload);

    response(res, null, 200);
  });
}
