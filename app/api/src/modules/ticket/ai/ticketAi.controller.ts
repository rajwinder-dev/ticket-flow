import { appError } from '../../../core/utils/appError';
import { catchAsync } from '../../../core/utils/catchAsync';
import response from '../../../core/utils/response';
import { TicketService } from '../ticket/ticket.service';
import { TicketAiService } from './ticketAi.service';

class TicketAiControllerClass {
  createTicketSummary = catchAsync(async (req, res, _next) => {
    const input = await TicketAiService.analyzeTicketSummary({
      organizationId: req.organization.id,
      ticketId: req.params.id as string,
    });
    if (input) {
      const updated = await TicketService.updateTicket({
        organizationId: req.organization.id,
        ticketId: req.params.id as string,
        input,
        userId: req.user.id,
      });
      response(res, updated, 200);
    }
    throw new appError('empty Ai resposne', 500);
  });
}

export const TicketAiController = new TicketAiControllerClass();
