import { ActivityLogSchema, ActivitySummaryResponse } from "@org/zod";
import { type FilterOptions} from "@org/web-utils"
import { api } from "../../api.js";
export const activityApi = {
  getAllActivity: async (filterOptions?: FilterOptions) => {
    const data = await  api.getMany<ActivityLogSchema>({ path: "activity" , filterOptions});
    return data;
  },
  getSummary: async () => {
    const data = await api.get<ActivitySummaryResponse>({ path: "activity/summary" });
    return data;
  },
};
