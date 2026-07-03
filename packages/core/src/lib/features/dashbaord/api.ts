import { getRequest, getRequestMany } from "@org/utils";
import { type RecentTicketSchema, type StatusCountsSchema } from "@org/zod";

export const dashboardApi = {
  getSummary: async () => {
    const data = await getRequest<StatusCountsSchema>({ path: "/dashboard/summary" });
    return data;
  },
  getRecentTickets: async () => {
    const data = await getRequestMany<RecentTicketSchema>({ path: "/dashboard/recent-tickets" });
    return data;
  },
};
