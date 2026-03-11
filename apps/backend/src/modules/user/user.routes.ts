import { Router } from "express";
import { UserController } from "./user.controller";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { onboardUserInput } from "@repo/schemas";

const userRouter = Router();

userRouter.post("/onboard", validationMiddleware(onboardUserInput), UserController.onboardUser)
export default userRouter
