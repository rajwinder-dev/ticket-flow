// import { jwtDecode } from "jwt-decode";
import type { ChangePasswordInput, LoginInput, SignupInput } from "@repo/schemas";
import type { InternalAxiosRequestConfig } from "axios";
import type { AuthData } from "../types/authTypes";
import { api, postRequest, refreshClient } from "../utils/axis";
let accessToken: string | undefined;

export const tokenManager = {
  get: () => accessToken,
  set: (token: string) => {
    accessToken = token;
  },
  clear: () => {
    accessToken = undefined;
  },
};
export async function signUp(input: SignupInput) {
  const data = await postRequest<AuthData>({
    path: "/auth/signup",
    data: input,
  });
  tokenManager.set(data.accessToken);
  return data;
}
export async function login(input: LoginInput) {
  const data = await postRequest<AuthData>({
    path: "/auth/login",
    data: input,
  });
  tokenManager.set(data.accessToken);
  return data;
}
export async function refreshToken() {
  const res = await refreshClient.post("/auth/refresh-token", {});
  return res.data.accessToken;
}
export async function forgetPassword(email: string) {
  const res = await refreshClient.post(`/auth/forget-password/${email}`, {});
  return res.data.accessToken;
}
export async function resetPassword(token: string) {
  const res = await refreshClient.post(`/auth/reset-password/${token}`, {});
  return res.data.accessToken;
}
export async function changePassword(input: ChangePasswordInput) {
  const data = await postRequest({
    path: "/auth/change-password",
    data: input,
  });
  return data;
}
export async function logOut() {
  const data = await postRequest({
    path: "/auth/logout",
    data: null,
  });
  return data;
}

// handle refresh token


api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.get();
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response.data.code === "INVALID_TOKEN" && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const accessToken = await refreshToken();
        tokenManager.set(accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
