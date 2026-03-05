import express from "express";

import {
  changePasswordSchema,
  loginSchema,
  updatePasswordSchema,
} from "./auth.zod";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { authController } from "./auth.controller";
import { authMiddleware } from "../../core/middleware/auth.middleware";
const authRouter = express.Router();

authRouter
  .route("/login")
  .post(validationMiddleware(loginSchema), authController.login);
authRouter.route("/refresh-token").post(authController.refreshToken);
authRouter.use(authMiddleware.protectedRoute);

authRouter
  .route("/changePassword")
  .patch(
    validationMiddleware(changePasswordSchema),
    authController.changePassword
  );
authRouter.route("/logout").post(authController.logout);

authRouter.use(authMiddleware.restrictRote("admin"));

authRouter
  .route("/updatePassword/:id")
  .patch(
    validationMiddleware(updatePasswordSchema),
    authMiddleware.assignRolePreProcessor,
    authController.updatePassword
  );

export default authRouter;
