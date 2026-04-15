import { catchAsync } from "../../core/utils/catchAsync.js";
import response from "../../core/utils/response.js";
import { dashboardService } from "./dashboard.service.js";

export class dashboardController {
  static getSummary = catchAsync(async (req, res, _next) => {
    const data = await dashboardService.ticketSummary(req.organization.id);
    response(res, data);
  });
  static getAssignedTickets = catchAsync(async (req, res, _next) => {})
}
