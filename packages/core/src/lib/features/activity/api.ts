import { ActivityLogSchema, ActivitySummaryResponse } from "@org/zod";
import { type FilterOptions , getRequestMany, getRequest} from "@org/web-utils"
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
