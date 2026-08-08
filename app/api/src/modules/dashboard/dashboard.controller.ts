import { recentTicketSchema, statusCountsSchema } from '@org/zod';
import { catchAsync } from '../../core/utils/catchAsync.js';
import response from '../../core/utils/response.js';
import { dashboardService } from './dashboard.service.js';
import z from 'zod';

export class dashboardController {
  static getSummary = catchAsync(async (req, res, _next) => {
    const data = await dashboardService.ticketSummary(req.organization.id);
    response(res, data, 200, { schema: statusCountsSchema });
  });
  static getRecentTickets = catchAsync(async (req, res, _next) => {
    const data = await dashboardService.getRecentTickets(req.organization.id);
    response(res, data, 200, { schema: z.array(recentTicketSchema) });
  });
}
