import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { OrganizationController } from "./organization.controller";

const organizationRouter = Router();

organizationRouter.use(authMiddleware.protectedRoute);

organizationRouter
  .route("/")
  .post(OrganizationController.createOrganization)
  .get(OrganizationController.getAllOrganization);

organizationRouter
  .route("/:id")
  .patch(OrganizationController.updateOrganization)
  .delete(OrganizationController.deleteOrganization);

export default organizationRouter;
