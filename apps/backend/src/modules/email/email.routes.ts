import { createEmailProviderInput, createSmtpInput } from "@repo/schemas";
import express from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { authMiddleware } from "../auth/auth.middleware";
import { EmailController } from "./email.controller";

const emailRouter = express.Router();
emailRouter.post("/webhook/:orgId", EmailController.webHook);
emailRouter.use(authMiddleware.protectedRoute, authMiddleware.tenant);
emailRouter.post(
  "/",
  authMiddleware.restrictToOwner,
  validationMiddleware(createEmailProviderInput),
  EmailController.createProvider,
);
emailRouter.get("/", EmailController.getProviders);
emailRouter.post(
  "/smtp",
  authMiddleware.restrictToOwner,
  validationMiddleware(createSmtpInput),
  EmailController.createSMTP,
);
emailRouter.patch(
  "/:id",
  authMiddleware.restrictToOwner,
  validationMiddleware(createEmailProviderInput),
  EmailController.updateCredentials,
);
emailRouter.delete("/:id", authMiddleware.restrictToOwner, EmailController.deleteCredentials);
emailRouter.get("/test", EmailController.testEmail);
export default emailRouter;
