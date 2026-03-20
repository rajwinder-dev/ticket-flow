import { createEmailProviderInput, updateEmailProviderInput } from "@repo/schemas";
import express from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { authMiddleware } from "../auth/auth.middleware";
import { EmailController } from "./email.controller";

const emailRouter = express.Router();
emailRouter.use(authMiddleware.protectedRoute, authMiddleware.tenant);
emailRouter.post(
  "/",
  authMiddleware.verifyPermissions("email", "create"),
  validationMiddleware(createEmailProviderInput),
  EmailController.createProvider,
);
emailRouter.patch(
  "/:id",
  authMiddleware.verifyPermissions("email", "update"),
  validationMiddleware(createEmailProviderInput),
  EmailController.updateCredentials,
);
emailRouter.get("/test", EmailController.testEmail);
export default emailRouter;
