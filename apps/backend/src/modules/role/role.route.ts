import { createRoleInput, updateRoleInput, validUuidParams } from "@repo/schemas";
import express from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { roleController } from "./role.controller.js";
const roleRouter = express.Router();

roleRouter.use(
  authMiddleware.protectedRoute,
  authMiddleware.tenant,
  authMiddleware.restrictToOwner,
);

roleRouter
  .route("/")
  .get(roleController.getAllRoles)
  .post(validationMiddleware(createRoleInput), roleController.createRole);
roleRouter.route("/:id").get(validationMiddleware(validUuidParams), roleController.getRoleDetails);
roleRouter
  .route("/:id")
  .patch(
    authMiddleware.restrictToOwner,
    validationMiddleware(updateRoleInput),
    roleController.updateRole,
  )
  .delete(authMiddleware.restrictToOwner, roleController.deleteRole);

export default roleRouter;
