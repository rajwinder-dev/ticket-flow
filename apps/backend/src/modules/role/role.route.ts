import express from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { authMiddleware } from "../auth/auth.middleware";
import { roleController } from "./role.controller";
import { roleSchema, updateRoleSchema } from "./role.zod";
const roleRouter = express.Router();

roleRouter.use(authMiddleware.protectedRoute, authMiddleware.restrictRote("admin"));

roleRouter
  .route("/")
  .get(roleController.getAllRoles)
  .post(validationMiddleware(roleSchema), roleController.createRole);

roleRouter
  .route("/:id")
  .delete(roleController.deleteRole)
  .patch(validationMiddleware(updateRoleSchema), roleController.updateRole);

export default roleRouter;
