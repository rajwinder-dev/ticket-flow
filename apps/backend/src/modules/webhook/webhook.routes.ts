import { Router } from "express";
import { resendWebhookController } from "./resendWebhooks.controller.js";
const webhookRouter = Router();
webhookRouter.post("/resend", resendWebhookController.events);

export default webhookRouter;
