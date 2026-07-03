import type { FilterOptions } from "@org/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { activityApi } from "./api.js";
interface props {
  filterOptions?: FilterOptions;
}
const useActivity = ({ filterOptions }: props = {}) => {
  const { orgId } = useParams();
  const {
    data: activity,
    isLoading: isLoadingActivity,
    error: activityError,
  } = useQuery({
    queryFn: () => activityApi.getAllActivity(filterOptions),
    queryKey: ["activity", { orgId }, filterOptions],
    enabled: !!orgId,
  });
  const {
    data: activitySummary,
    isLoading: isLoadingActivitySummary,
    error: summaryError,
  } = useQuery({
    queryFn: activityApi.getSummary,
    queryKey: ["activity", "summary", { orgId }],
    enabled: !!orgId,
  });
  return {
    activity,
    isLoadingActivity,
    activitySummary,
    isLoadingActivitySummary,
    activityError,
    summaryError,
  };
};

export default useActivity;
