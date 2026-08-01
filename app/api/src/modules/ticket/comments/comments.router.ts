import { Router } from 'express';
import { authMiddleware } from '../../auth/auth.middleware';
import { validationMiddleware } from '../../../core/middleware/validationMiddleware';
import { TicketCommentsController } from './comments.controller';
import { createTicketCommentInput } from '@org/zod';

const TicketCommentsRouter: Router = Router();

TicketCommentsRouter.post(
  '/:id/comment',
  authMiddleware.verifyPermission('comment', 'create'),
  validationMiddleware(createTicketCommentInput),
  TicketCommentsController.addComment,
);
TicketCommentsRouter.get(
  '/:id/comment',
  authMiddleware.verifyPermission('comment', 'create'),
  TicketCommentsController.getTicketComments,
);

export default TicketCommentsRouter;
