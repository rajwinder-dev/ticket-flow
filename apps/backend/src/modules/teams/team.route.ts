import express from "express";
import { params } from "../../core/zod/global.zod";
import { teamMemberSchema } from "./team.zod";
import { authMiddleware } from "../../core/middleware/auth.middleware";
import { teamController } from "./team.controller";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";

const teamRouter = express.Router();
teamRouter.use(authMiddleware.protectedRoute);

teamRouter
  .route("/me")
  .get(authMiddleware.restrictRote("manager"), teamController.getMyTeamMembers);

teamRouter.use(authMiddleware.restrictRote("admin"));
teamRouter.route("/summary").get(teamController.teamSummary);
teamRouter
  .route("/:id")
  .post(validationMiddleware(teamMemberSchema), teamController.assignTeam)
  .delete(validationMiddleware(params), teamController.deleteMember)
  .get(validationMiddleware(params), teamController.getTeamMembers);

export default teamRouter;
