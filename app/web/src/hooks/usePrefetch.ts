import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { ticketApi } from "@/features/ticket/api";

export function useOrgPrefetch() {
  const queryClient = useQueryClient();
  const { orgId } = useParams();

  useEffect(() => {
    if (!orgId) return;

    // 2. Define a shared staleTime for background prefetching
    const PREFETCH_STALE_TIME = 1000 * 60 * 5; // 5 minutes

    const prefetchCoreData = async () => {
      try {
        queryClient.prefetchQuery({
          queryKey: [
            "ticket",
            { orgId },
            { filter: {}, limit: 10, offset: 0, search: { searchBy: "subject" } },
          ],
          queryFn: () => ticketApi.getAll(),
          staleTime: PREFETCH_STALE_TIME,
        });
        queryClient.prefetchQuery({
          queryKey: ["ticket", "summary", { assignedTo: { assignedTo: null }, orgId }],

          queryFn: () => ticketApi.getAll(),
          staleTime: PREFETCH_STALE_TIME,
        });
      } catch (error) {
        console.error("Failed to prefetch organization data:", error);
      }
    };

    prefetchCoreData();
  }, [orgId, queryClient]);
}
