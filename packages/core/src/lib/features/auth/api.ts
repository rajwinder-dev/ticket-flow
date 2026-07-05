import type { ApiMessage } from "@org/web-utils";
import {
  tokenSchemaResponse,
  type AuthDetails,
  type AuthToken,
  type ChangePasswordInput,
  type LoginInput,
  type ResetPasswordInput,
  type SignupInput,
} from "@org/zod";
import { api } from "../../api.js";

export const authApi = {
  signUp: async (input: SignupInput) => {
    const data = await  api.post<AuthToken>({
      path: "/auth/signup",
      data: input,
    });
    return data;
  },

  login: async (input: LoginInput) => {
    const data = await api.post<AuthToken>({
      path: "/auth/login",
      data: input,
    });
    return data;
  },

  refresh: async () => {
    const res = await api.post<AuthToken>({
      path: "/auth/refresh-token",
    });
    return res;
  },

  forgotPassword: async (email: string) => {
    const res = await api.get({
      path: `/auth/forget-password/${email}`,
    });
    return res;
  },

  resetPassword: async ({ token, input }: { token: string; input: ResetPasswordInput }) => {
    const res = await api.patch<ApiMessage>({
      path: `/auth/reset-password/${token}`,
      data: input,
    });
    return res;
  },

  changePassword: async (input: ChangePasswordInput) => {
    const data = await api.patch<ApiMessage>({
      path: "/auth/change-password",
      data: input,
    });
    return data;
  },

  logout: async () => {
    const data = await api.patch({
      path: "/auth/logout",
    });
    return data;
  },

  getDetails: async () => {
    const data = await api.get<AuthDetails>({
      path: "/auth/details",
    });
    return data;
  },
  tokenDetails: async (token: string) => {
    const data = await api.get<tokenSchemaResponse>({
      path: `/token/${token}/details`,
    });
    return data;
  },
};
// handle refresh token
