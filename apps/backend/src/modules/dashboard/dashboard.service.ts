import { TicketStatus } from "../../../generated/prisma";
import { prisma } from "../../core/utils/prismaClient";

export class dashboardService {
  static ticketSummary = async (organizationId: string) => {
    const data = await prisma.ticket.groupBy({
      where: {
        organizationId,
      },
      by: "status",
      _count: true
    });
    const formattedData = data.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {} as Record<TicketStatus, number>);
  //  if not exist, set to 0
    const statuses: TicketStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "ON_HOLD", "REOPENED"]; ;
    for (const status of statuses) {
      if (!formattedData[status]) {
        formattedData[status] = 0;
      }
    }
   return formattedData
  };
}
