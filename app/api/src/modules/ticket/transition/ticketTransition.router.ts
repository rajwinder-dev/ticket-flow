import { Router } from 'express';
import { authMiddleware } from '../../auth/auth.middleware';
import { TicketTransitionController } from './ticketTransition.controller';
import { validationMiddleware } from '../../../core/middleware/validationMiddleware';
import {
  assignTicketInput,
  escalateTicketInput,
  updateTicketPriorityInput,
  updateTicketStatusInput,
} from '@org/zod';

const TicketTransitionRouter: Router = Router();
TicketTransitionRouter.get(
  '/:id/transitions',
  authMiddleware.verifyPermission('ticket', 'transition_history'),
  TicketTransitionController.getTransitionHistory,
);
TicketTransitionRouter.patch(
  '/:id/status',
  authMiddleware.verifyPermission('ticket', 'change_status'),
  validationMiddleware(updateTicketStatusInput),
  TicketTransitionController.updateStatus,
);
TicketTransitionRouter.patch(
  '/:id/priority',
  authMiddleware.verifyPermission('ticket', 'change_priority'),
  validationMiddleware(updateTicketPriorityInput),
  TicketTransitionController.updatePriority,
);
TicketTransitionRouter.patch(
  '/:id/assign',
  authMiddleware.verifyPermission('ticket', 'assign'),
  validationMiddleware(assignTicketInput),
  TicketTransitionController.assignTicket,
);
TicketTransitionRouter.post(
  '/:id/escalate',
  authMiddleware.verifyPermission('ticket', 'escalate'),

  validationMiddleware(escalateTicketInput),
  TicketTransitionController.escalate,
);
TicketTransitionRouter.get(
  '/:id/escalate-options',
  authMiddleware.verifyPermission('ticket', 'escalate'),
  TicketTransitionController.getEscalateOptions,
);

export default TicketTransitionRouter;
