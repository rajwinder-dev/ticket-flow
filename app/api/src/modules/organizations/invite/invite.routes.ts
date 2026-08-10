import { Router } from "express";
import { authMiddleware } from "../../auth/auth.middleware";
import { InviteController } from "./invite.controller";
import { validationMiddleware } from "../../../core/middleware/validationMiddleware";
import { inviteUserOrganizationInput } from "@org/zod";

const inviteRouter: Router = Router()
inviteRouter.get('/:token/invite/', InviteController.InviteDetails);
inviteRouter.use(authMiddleware.protectedRoute);
inviteRouter.post('/:token/invite/', InviteController.acceptInvite);
inviteRouter.post(
  '/invite',
  validationMiddleware(inviteUserOrganizationInput),
  InviteController.sendInvite,
);



export default inviteRouter
