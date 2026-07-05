import type { FilterOptions } from "@/types/axis.types";
import { getRequest, getRequestMany } from "@/utils/axis";
import type { ActivityLogSchema, ActivitySummaryResponse } from "@org/zod";

export const activityApi = {
  getAllActivity: async (filterOptions?: FilterOptions) => {
    const data = await getRequestMany<ActivityLogSchema>({ path: "activity" , filterOptions});
    return data;
  },
  getSummary: async () => {
    const data = await getRequest<ActivitySummaryResponse>({ path: "activity/summary" });
    return data;
  },
};
