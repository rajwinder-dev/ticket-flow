import { createOrganizationInput } from "@repo/schemas";
import { Router } from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { authMiddleware } from "../auth/auth.middleware";
import { OrganizationController } from "./organization.controller";

const organizationRouter = Router();

organizationRouter.use(authMiddleware.protectedRoute);

organizationRouter.route("/me").get(OrganizationController.getMyOrganizations);
organizationRouter
  .route("/")
  .post(validationMiddleware(createOrganizationInput), OrganizationController.createOrganization);

organizationRouter
  .route("/:id")
  .patch(OrganizationController.updateOrganization)
  .delete(OrganizationController.deleteOrganization);

export default organizationRouter;
