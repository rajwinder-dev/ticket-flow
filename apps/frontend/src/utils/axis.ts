import { authApi } from "@/features/auth/api";
import { tokenManager } from "@/lib/tokenManager";
import axios, { type InternalAxiosRequestConfig } from "axios";
import { redirect } from "react-router";
import { apiUrl } from "../config/apiconfig";
import type {
  ApiResponse,
  FilterOptions,
  geneticApiResponse,
  PaginateResponse,
  PostRequest,
} from "../types/axis.types";

export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export async function postRequest<T = geneticApiResponse>({
  path,
  data,
  headers = "application/json",
  options,
}: PostRequest): Promise<ApiResponse<T>> {
  return await catchError(async () => {
    const response = await api.post<ApiResponse<T>>(`${path}`, data, {
      headers: {
        "Content-Type": headers,
      },
      ...(options || {}),
    });
    const res = response.data;
    return res;
  });
}

export async function getRequest<T = geneticApiResponse>({
  path,
  filterOptions,
  headers = "application/json",
}: {
  path: string;
  filterOptions?: FilterOptions;
  headers?: string;
}): Promise<ApiResponse<T>> {
  return await catchError(async () => {
    let query = "";
    if (filterOptions) query = buildQuery(filterOptions);
    const response = await api.get<ApiResponse<T>>(`${path}?${query}`, {
      headers: {
        "Content-Type": headers,
      },
    });
    const res = response.data;
    if (res.status === "fail") throw new Error(res.message);

    return res;
  });
}
export async function getRequestMany<T>({
  path,
  filterOptions,
  headers = "application/json",
}: {
  path: string;
  filterOptions?: FilterOptions;
  headers?: string;
}): Promise<PaginateResponse<T>> {
  return await catchError(async () => {
    let query = "";
    if (filterOptions) query = buildQuery(filterOptions);
    const response = await api.get<PaginateResponse<T>>(`${path}?${query}`, {
      headers: {
        "Content-Type": headers,
      },
    });
    const res = response.data;
    if (res.status === "fail") throw new Error(res.message);
    return res;
  });
}
export async function patchRequest<T = geneticApiResponse>({
  path,
  data,
  headers = "application/json",
}: PostRequest): Promise<ApiResponse<T>> {
  return await catchError(async () => {
    const response = await api.patch<ApiResponse<T>>(`${path}`, data, {
      headers: {
        "Content-Type": headers,
      },
    });
    const res = response.data;
    if (res.status === "fail") throw new Error(res.message);
    return res;
  });
}
export async function deleteRequest<T = geneticApiResponse>({
  path,
  filterOptions,
  headers = "application/json",
}: {
  path: string;
  filterOptions?: FilterOptions;
  headers?: string;
}): Promise<ApiResponse<T>> {
  let query = "";
  if (filterOptions) query = buildQuery(filterOptions);
  return await catchError(async () => {
    const response = await api.delete<ApiResponse<T>>(`${path}?${query}`, {
      headers: {
        "Content-Type": headers,
      },
    });
    const res = response.data;
    if (res.status === "fail") throw new Error(res.message);
    return res;
  });
}
// axios helper
export function buildQuery(input: Record<string, string | number | boolean | string[] | object>) {
  const array: string[] = [];
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) {
      array.push(`${key}=${value.join(",")}`);
    } else if (typeof value === "object" && value !== null) {
      for (const [key, subValue] of Object.entries(value)) {
        array.push(`${key}=${subValue}`);
      }
    } else {
      array.push(`${key}=${value}`);
    }
  }
  return array.join("&");
}

export async function catchError<T>(callback: () => Promise<T>): Promise<T> {
  try {
    return await callback();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiMsg = error.response?.data?.message || error.message;
      throw {
        message: apiMsg,
        status: error.response?.status,
        data: error.response?.data,
      };
    }
    const unknownError = new Error("Unknown error occurred");
    throw unknownError;
  }
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.get();
    const organizationId = getOrgIdFromUrl();
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    if (organizationId) config.headers["x-organization-id"] = organizationId;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async function (error) {
    console.error(error.response.data);
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response.data.code === "INVALID_TOKEN" && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await authApi.refresh();
        tokenManager.set(res.data.accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (error) {
        redirect("/login");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
// apiClient.ts
export function getOrgIdFromUrl() {
  const match = window.location.pathname.match(/org\/([^/]+)/);
  return match?.[1];
}
