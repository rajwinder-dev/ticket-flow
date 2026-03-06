import express from "express";

import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { params } from "../../core/zod/global.zod";
import { authMiddleware } from "../auth/auth.middleware";
import { roleAssignController } from "./roleAssign.controller";
import { roleAssignSchema, updateRoleAssignSchema } from "./roleAssign.zod";
const roleAssignRouter = express.Router();
roleAssignRouter.use(authMiddleware.protectedRoute);
roleAssignRouter.route("/myRole").get(roleAssignController.getMyRole);

roleAssignRouter.use(authMiddleware.restrictRote("admin"));
roleAssignRouter.route("/").get(roleAssignController.getRoles);
roleAssignRouter.route("/summary").get(roleAssignController.roleSummary);
roleAssignRouter
  .route("/:id")
  .post(
    validationMiddleware(roleAssignSchema),
    authMiddleware.assignRolePreProcessor,
    roleAssignController.assignRole,
  )
  .delete(validationMiddleware(params), roleAssignController.removeRole)
  .patch(validationMiddleware(updateRoleAssignSchema), roleAssignController.updateRole);
export default roleAssignRouter;
