import type { UpdateMyDetailsInput, UserSchema } from "@org/zod";
import { api } from "../../api.js";

export const userApi = {
  myDetails: async () => {
    const data = await api.get<UserSchema>({
      path: `/user/me`,
    });
    return data;
  },
  updateMyDetails: async (input: UpdateMyDetailsInput) => {
    const data = await api.patch<UserSchema>({
      path: `/user/me`,
      data: input,
    });
    return data;
  },
};
