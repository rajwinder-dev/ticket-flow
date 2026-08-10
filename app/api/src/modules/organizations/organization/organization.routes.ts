import { createOrganizationInput, updateOrganizationInput } from '@org/zod';
import { Router } from 'express';
import { validationMiddleware } from '../../../core/middleware/validationMiddleware.js';
import { authMiddleware } from '../../auth/auth.middleware.js';
import { OrganizationController } from './organization.controller.js';

const organizationRouter: Router = Router();
organizationRouter.use(authMiddleware.protectedRoute);
organizationRouter.get('/me', OrganizationController.getMyOrganizations);
organizationRouter.post(
  '/',
  validationMiddleware(createOrganizationInput),
  OrganizationController.createOrganization,
);
organizationRouter.use(authMiddleware.tenant, authMiddleware.restrictToOwner);

organizationRouter
  .route('/')
  .patch(
    validationMiddleware(updateOrganizationInput),
    OrganizationController.updateOrganization,
  )
  .delete(
    authMiddleware.restrictToOwner,
    OrganizationController.deleteOrganization,
  );
organizationRouter.get(
  '/current',
  OrganizationController.getCurrentOrganization,
);

organizationRouter.get('/member', OrganizationController.getMembers);
organizationRouter.get(
  '/onboardStatus',
  OrganizationController.getOnBoardingStatus,
);

export default organizationRouter;
