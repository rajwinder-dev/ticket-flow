import express from "express";

import { authMiddleware } from "../auth/auth.middleware";
import MemberController from "./member.controller";

const MemberRouter = express.Router();
MemberRouter.use(authMiddleware.protectedRoute, authMiddleware.tenant);

MemberRouter.get("/", MemberController.getMembers);

export default MemberRouter;
