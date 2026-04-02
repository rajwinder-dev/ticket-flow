import { getRequest } from "@/utils/axis";
import type { UserSchema } from "@repo/schemas";

export const userApi = {
  myDetails: async () => {
    const data = await getRequest<UserSchema>({
      path: `/user/me`,
    });
    return data;
  },
};
