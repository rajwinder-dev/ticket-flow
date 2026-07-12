import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './api.js';
interface props {
  orgId: string | undefined;
}
export const useDashboard = ({ orgId }: props) => {
  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryFn: () => dashboardApi.getSummary(),
    queryKey: ['dashboard', 'summary', { orgId }],
  });
  const { data: recentTickets, isLoading: isLoadingRecentTicket } = useQuery({
    queryFn: () => dashboardApi.getRecentTickets(),
    queryKey: ['dashboard', 'tickets', 'recent', { orgId }],
  });
  return { summary, isLoadingSummary, recentTickets, isLoadingRecentTicket };
};
