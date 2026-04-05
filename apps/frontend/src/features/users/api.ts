import { getRequest, getRequestMany, patchRequest } from "@/utils/axis";
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
  getMembers: async () => {
    const data = await getRequestMany<UserSchema>({
      path: `/org/member`,
    });
    return data;
  },
};
