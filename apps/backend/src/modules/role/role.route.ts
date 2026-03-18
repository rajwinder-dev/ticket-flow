import { creteRoleInput, updateRoleInput } from "@repo/schemas/src/role.zod";
import express from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { authMiddleware } from "../auth/auth.middleware";
import { roleController } from "./role.controller";
const roleRouter = express.Router();

roleRouter.use(authMiddleware.protectedRoute, authMiddleware.tenant);

roleRouter
  .route("/")
  .get(roleController.getAllRoles)
  .post(
    authMiddleware.verifyPermissions("role", "create"),
    validationMiddleware(creteRoleInput),
    roleController.createRole,
  );
roleRouter.route("/:id").get(roleController.getRoleDetails);
roleRouter
  .route("/:id")
  .patch(
    authMiddleware.verifyPermissions("role", "update"),
    validationMiddleware(updateRoleInput),
    roleController.updateRole,
  )
  .delete(authMiddleware.verifyPermissions("role", "delete"), roleController.deleteRole);

export default roleRouter;
