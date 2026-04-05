import { onboardUserInput, updateMyDetailsInput } from "@repo/schemas";
import { Router } from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { authMiddleware } from "../auth/auth.middleware";
import { UserController } from "./user.controller";

const userRouter = Router();
userRouter.use(authMiddleware.protectedRoute);
userRouter.post("/onboard", validationMiddleware(onboardUserInput), UserController.onboardUser);
userRouter
  .route("/me")
  .get(UserController.getMyDetails)
  .patch(validationMiddleware(updateMyDetailsInput), UserController.updateMyDetails);

export default userRouter;
