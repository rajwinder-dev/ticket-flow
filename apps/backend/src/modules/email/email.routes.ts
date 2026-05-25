import { createEmailProviderInput, createSmtpInput } from "@repo/schemas";
import express, { Router } from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { EmailController } from "./email.controller.js";

const emailRouter: Router = express.Router();

emailRouter.get("/test", EmailController.testEmail);
emailRouter.post("/webhook/:orgId", EmailController.webHook);
emailRouter.use(
  authMiddleware.protectedRoute,
  authMiddleware.tenant,
  authMiddleware.restrictToOwner,
);
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
export default emailRouter;
