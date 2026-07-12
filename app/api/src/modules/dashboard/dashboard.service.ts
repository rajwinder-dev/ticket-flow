import { getTenantClient, TicketStatus } from "@org/database";

export class dashboardService {
  static ticketSummary = async (organizationId: string) => {
    const tenantdb = getTenantClient(organizationId);
    const data = await tenantdb.ticket.groupBy({
      where: {
        organizationId,
      },
      by: "status",
      _count: true,
    });
    const TOTAL = await tenantdb.ticket.count({
      where: {
        organizationId,
      },
    });
    const formattedData = data.reduce(
      (acc, item) => {
        acc[item.status] = item._count;
        return acc;
      },
      {} as Record<TicketStatus, number>,
    );
    //  if not exist, set to 0
    const statuses: TicketStatus[] = [
      "OPEN",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
      "ON_HOLD",
      "REOPENED",
    ];
    for (const status of statuses) {
      if (!formattedData[status]) {
        formattedData[status] = 0;
      }
    }
    return { ...formattedData, TOTAL };
  };
}
