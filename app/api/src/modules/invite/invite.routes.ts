import { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { InviteController } from './invite.controller';
import { validationMiddleware } from '../../core/middleware/validationMiddleware';
import { inviteUserOrganizationInput } from '@org/zod';

const inviteRouter: Router = Router();
inviteRouter.get('/:token', InviteController.InviteDetails);
inviteRouter.use(authMiddleware.protectedRoute);
inviteRouter.post('/:token', InviteController.acceptInvite);
inviteRouter.use(authMiddleware.tenant);
inviteRouter.post(
  '/',
  validationMiddleware(inviteUserOrganizationInput),
  InviteController.sendInvite,
);

export default inviteRouter;
