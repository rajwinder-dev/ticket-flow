import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { dashboardApi } from "./api.js";

export const useDashboard = () => {
  const { orgId } = useParams();

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryFn: () => dashboardApi.getSummary(),
    queryKey: ["dashboard", "summary", { orgId }],
  });
  const { data: recentTickets, isLoading: isLoadingRecentTicket } = useQuery({
    queryFn: () => dashboardApi.getRecentTickets(),
    queryKey: ["dashboard", "tickets", "recent", { orgId }],
  });
  return { summary, isLoadingSummary, recentTickets, isLoadingRecentTicket };
};
