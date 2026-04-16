import { createOrganizationInput, inviteUserOrganizationInput } from "@repo/schemas";
import { Router } from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { OrganizationController } from "./organization.controller.js";

const organizationRouter: Router = Router();
organizationRouter.get("/:token/invite/", OrganizationController.InviteDetails);
organizationRouter.use(authMiddleware.protectedRoute);
organizationRouter.get("/me",OrganizationController.getMyOrganizations);
organizationRouter.post("/:token/invite/", OrganizationController.acceptInvite);
organizationRouter.post(
  "/",
  validationMiddleware(createOrganizationInput),
  OrganizationController.createOrganization,
);
organizationRouter.use(authMiddleware.tenant, authMiddleware.restrictToOwner);

organizationRouter
  .route("/")
  .patch(OrganizationController.updateOrganization)
  .delete(OrganizationController.deleteOrganization);
organizationRouter.get("/current", OrganizationController.getCurrentOrganization);
organizationRouter.post(
  "/invite",
  validationMiddleware(inviteUserOrganizationInput),
  OrganizationController.sendInvite,
);


organizationRouter.get("/member", OrganizationController.getMembers)



export default organizationRouter;
