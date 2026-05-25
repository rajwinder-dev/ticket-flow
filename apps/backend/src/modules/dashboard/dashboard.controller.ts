import { recentTicketSchema, statusCountsSchema } from "@repo/schemas";
import { startOfWeek } from "date-fns";
import { catchAsync } from "../../core/utils/catchAsync.js";
import response from "../../core/utils/response.js";
import { dashboardService } from "./dashboard.service.js";
import z from "zod";
import { getTenantClient } from "@repo/database";

export class dashboardController {
  static getSummary = catchAsync(async (req, res, _next) => {
    const data = await dashboardService.ticketSummary(req.organization.id);
    response(res, data, 200, { schema: statusCountsSchema });
  });
  static getRecentTickets = catchAsync(async (req, res, _next) => {
    const tenantdb = getTenantClient(req.organization.id);
    const data = await tenantdb.ticket.findMany({
      where: {
        updatedAt: {
          gt: startOfWeek(new Date()),
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        code: true,
        subject: true,
        priority: true,
        status: true,
        assignedToUser: {
          select: {
            username: true,
          },
        },
      },
    });
    response(res, data, 200, { schema: z.array(recentTicketSchema) });
  });
}
