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
import { getRequest, patchRequest, postRequest } from "@org/web-utils";

export const authApi = {
  signUp: async (input: SignupInput) => {
    const data = await postRequest<AuthToken>({
      path: "/auth/signup",
      data: input,
    });
    return data;
  },

  login: async (input: LoginInput) => {
    const data = await postRequest<AuthToken>({
      path: "/auth/login",
      data: input,
    });
    return data;
  },

  refresh: async () => {
    const res = await getRequest<AuthToken>({
      path: "/auth/refresh-token",
    });
    return res;
  },

  forgotPassword: async (email: string) => {
    const res = await getRequest({
      path: `/auth/forget-password/${email}`,
    });
    return res;
  },

  resetPassword: async ({ token, input }: { token: string; input: ResetPasswordInput }) => {
    const res = await patchRequest<ApiMessage>({
      path: `/auth/reset-password/${token}`,
      data: input,
    });
    return res;
  },

  changePassword: async (input: ChangePasswordInput) => {
    const data = await patchRequest<ApiMessage>({
      path: "/auth/change-password",
      data: input,
    });
    return data;
  },

  logout: async () => {
    const data = await postRequest({
      path: "/auth/logout",
    });
    return data;
  },

  getDetails: async () => {
    const data = await getRequest<AuthDetails>({
      path: "/auth/details",
    });
    return data;
  },
  tokenDetails: async (token: string) => {
    const data = await getRequest<tokenSchemaResponse>({
      path: `/token/${token}/details`,
    });
    return data;
  },
};
// handle refresh token
