import { updateMyDetailsInput } from "@repo/schemas";
import { Router } from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { UserController } from "./user.controller.js";

const userRouter = Router();
userRouter.use(authMiddleware.protectedRoute);
userRouter
  .route("/me")
  .get(UserController.getMyDetails)
  .patch(validationMiddleware(updateMyDetailsInput), UserController.updateMyDetails);

export default userRouter;
