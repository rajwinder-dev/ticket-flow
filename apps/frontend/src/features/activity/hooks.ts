import type { FilterOptions } from "@/types/axis.types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { activityApi } from "./api";
interface props {
  filterOptions?: FilterOptions;
}
const useActivity = ({ filterOptions }: props = {}) => {
  const { orgId } = useParams();
  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryFn: () => activityApi.getAllActivity(filterOptions),
    queryKey: ["activity", { orgId }, filterOptions],
    enabled: !!orgId,
  });
  const { data: activitySummary, isLoading: isLoadingActivitySummary } = useQuery({
    queryFn: activityApi.getSummary,
    queryKey: ["activity", "summary", { orgId }],
    enabled: !!orgId,
  });
  return { activity, isLoadingActivity, activitySummary, isLoadingActivitySummary };
};

export default useActivity;
