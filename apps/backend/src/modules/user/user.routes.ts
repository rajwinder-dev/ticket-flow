import { Router } from "express";
import { UserController } from "./user.controller";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { onboardUserInput } from "@repo/schemas";
import { authMiddleware } from "../auth/auth.middleware";

const userRouter = Router();
userRouter.use(authMiddleware.protectedRoute)
userRouter.post("/onboard", validationMiddleware(onboardUserInput), UserController.onboardUser)
export default userRouter
