import { createOrganizationInput, inviteUserOrganizationInput } from "@repo/schemas";
import { Router } from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { authMiddleware } from "../auth/auth.middleware";
import { OrganizationController } from "./organization.controller";

const organizationRouter = Router();
organizationRouter.get("/invite/:token", OrganizationController.InviteDetails);
organizationRouter.use(authMiddleware.protectedRoute);
organizationRouter.post("/invite/:token", OrganizationController.acceptInvite);
organizationRouter.post(
  "/",
  validationMiddleware(createOrganizationInput),
  OrganizationController.createOrganization,
);
organizationRouter.get("/me", OrganizationController.getMyOrganizations);
organizationRouter.use(authMiddleware.tenant);


organizationRouter
  .route("/:id")
  .patch(OrganizationController.updateOrganization)
  .delete(OrganizationController.deleteOrganization);

organizationRouter.post(
  "/invite",
  validationMiddleware(inviteUserOrganizationInput),
  OrganizationController.sendInvite,
);

export default organizationRouter;
