import { getRequest, patchRequest } from "@/utils/axis";
import type { UpdateMyDetailsInput, UserSchema } from "@repo/schemas";

export const userApi = {
  myDetails: async () => {
    const data = await getRequest<UserSchema>({
      path: `/user/me`,
    });
    return data;
  },
  updateMyDetails: async (input: UpdateMyDetailsInput) => {
    const data = await patchRequest<UserSchema>({
      path: `/user/me`,
      data: input,
    });
    return data;
  },
};
