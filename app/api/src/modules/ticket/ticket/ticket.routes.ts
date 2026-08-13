import { createTicketInput, updateTicketInput } from '@org/zod';
import { Router } from 'express';
import { validationMiddleware } from '../../../core/middleware/validationMiddleware.js';
import { authMiddleware } from '../../auth/auth.middleware.js';
import { TicketController } from './ticket.controller.js';

const TicketRouter: Router = Router();
TicketRouter.use(authMiddleware.protectedRoute, authMiddleware.tenant);
TicketRouter.post(
  '/',
  authMiddleware.verifyPermission('ticket', 'create'),
  validationMiddleware(createTicketInput),
  TicketController.createTicket,
);
TicketRouter.patch(
  '/:id',
  authMiddleware.verifyPermission('ticket', 'edit'),
  validationMiddleware(updateTicketInput),
  TicketController.updateTicket,
);
TicketRouter.get(
  '/',
  authMiddleware.verifyPermission('ticket', 'view_all'),
  TicketController.getAllTickets,
);
TicketRouter.get(
  '/summary',
  authMiddleware.verifyPermission('ticket', 'summary'),
  TicketController.getSummary,
);
TicketRouter.get(
  '/me',
  authMiddleware.verifyPermission('ticket', 'view_own'),
  TicketController.getAssignedTickets,
);
TicketRouter.get(
  '/:id',
  authMiddleware.verifyPermission('ticket', 'details'),
  TicketController.getTicketDetails,
);
export default TicketRouter;
