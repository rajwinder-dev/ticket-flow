import { getRequest, getRequestMany } from "@/utils/axis";
import type { ActivityLogSchema, ActivitySummaryResponse } from "@repo/schemas";

export const activityApi = {
  getAllActivity: async () => {
    const data = await getRequestMany<ActivityLogSchema>({ path: "activity" });
    return data;
  },
  getSummary: async () => {
    const data = await getRequest<ActivitySummaryResponse>({ path: "activity/summary" });
    return data;
  },
};
