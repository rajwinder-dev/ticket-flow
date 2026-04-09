import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { activityApi } from "./api";

const useActivity = () => {
  const { orgId } = useParams();
  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryFn: activityApi.getAllActivity,
    queryKey: ["activity", orgId],
    enabled: !!orgId,
  });
  const { data: activitySummary, isLoading: isLoadingActivitySummary } = useQuery({
    queryFn: activityApi.getSummary,
    queryKey: ["activity", "summary", orgId],
    enabled: !!orgId,
  });
  return { activity, isLoadingActivity, activitySummary, isLoadingActivitySummary };
};

export default useActivity;
