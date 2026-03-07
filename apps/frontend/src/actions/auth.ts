// import { jwtDecode } from "jwt-decode";
import { api, postRequest, refreshClient } from "../utils/axis";
import type { AuthData, AuthLogin } from "../types/authTypes";
import type { InternalAxiosRequestConfig } from "axios";
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

export async function login({ username, password }: AuthLogin) {
  const data = await postRequest<AuthData>({
    path: "/auth/login",
    data: { username, password },
  });
  tokenManager.set(data.accessToken);
  return data;
}

export async function logOut() {
  const data = await postRequest({
    path: "/auth/logout",
    data: {},
  });
  return data;
}

// handle refresh token
export async function refreshToken() {
  const res = await refreshClient.post("/auth/refresh-token", {});
  return res.data.accessToken;
}

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
    if (
      error.response.data.code === "INVALID_TOKEN" &&
      !originalRequest._retry
    ) {
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
