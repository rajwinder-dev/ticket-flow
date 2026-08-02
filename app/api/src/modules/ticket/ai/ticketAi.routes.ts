import { Router } from 'express';
import { TicketAiController } from './ticketAi.controller';
import { authMiddleware } from '../../auth/auth.middleware';

const TicketAiRouter: Router = Router();
TicketAiRouter.use(authMiddleware.protectedRoute, authMiddleware.tenant);
TicketAiRouter.post('/ai/:id/summary', TicketAiController.createTicketSummary);

export default TicketAiRouter;
