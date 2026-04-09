import { getRequestMany } from "@/utils/axis";
import type { ActivityLogSchema } from "@repo/schemas";

export const activityApi = {
  getAllActivity: async () => {
    const data = await getRequestMany<ActivityLogSchema>({ path: "activity" });
    return data;
  },
};
