import express from "express";

import {
  changePasswordInput,
  loginInput,
  resetPasswordInput,
  signupInput,
  updatePasswordInput,
} from "@repo/schemas";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { authController } from "./auth.controller";
import { authMiddleware } from "./auth.middleware";
const authRouter = express.Router();
authRouter.route("/signUp").post(validationMiddleware(signupInput), authController.signup);
authRouter.route("/login").post(validationMiddleware(loginInput), authController.login);
authRouter.route("/refresh-token").post(authController.refreshToken);
authRouter.route("/forget-password/:email").get(authController.forgetPassword);
authRouter
  .route("/reset-password/:token")
  .patch(validationMiddleware(resetPasswordInput), authController.resetPassword);

authRouter.use(authMiddleware.protectedRoute);

authRouter.route("/profile").get(authController.getMyProfile);
authRouter
  .route("/change-password")
  .patch(validationMiddleware(changePasswordInput), authController.changePassword);
authRouter.route("/logout").post(authController.logout);

authRouter.use(authMiddleware.restrictRote("admin"));

authRouter
  .route("/update-password/:id")
  .patch(validationMiddleware(updatePasswordInput), authController.updatePassword);

export default authRouter;
