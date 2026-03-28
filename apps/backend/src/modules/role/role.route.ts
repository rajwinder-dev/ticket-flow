import { validUuidParams } from "@repo/schemas/src/global.zod";
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
    authMiddleware.restrictToOwner,
    validationMiddleware(creteRoleInput),
    roleController.createRole,
  );
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
