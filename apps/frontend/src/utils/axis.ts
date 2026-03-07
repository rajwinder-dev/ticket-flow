import axios, { type AxiosRequestConfig } from "axios";
import { apiUrl } from "../config/apiconfig";
import type { ApiResponse, PaginateResponse } from "../types/genetic";

type PostRequest = {
  path: string;
  data: object | null;
  headers?: string;
  options?: AxiosRequestConfig;
};
type FilterOptions = {
  limit?: number;
  offset?: number;
  sorting?: { sortby: string; sortOrder?: "asc" | "desc" };
  filter?: Record<string, string | number>;
  fields?: string[];
};

export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});
export const refreshClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

export async function postRequest<T>({
  path,
  data,
  headers = "application/json",
  options,
}: PostRequest): Promise<T> {
  return await catchError(async () => {
    const response = await api.post<ApiResponse<T>>(`${path}`, data, {
      headers: {
        "Content-Type": headers,
      },
      ...(options || {}),
    });
    const res = response.data;
    if (res.status === "fail") throw new Error(res.message);
    return res.data;
  });
}

export async function getRequest<T>({
  path,
  filterOptions,
  headers = "application/json",
}: {
  path: string;
  filterOptions?: FilterOptions;
  headers?: string;
}): Promise<T> {
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
    return res.data;
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
export async function patchRequest<T>({
  path,
  data,
  headers = "application/json",
}: PostRequest): Promise<T> {
  return await catchError(async () => {
    const response = await api.patch<ApiResponse<T>>(`${path}`, data, {
      headers: {
        "Content-Type": headers,
      },
    });
    const res = response.data;
    if (res.status === "fail") throw new Error(res.message);
    return res.data;
  });
}
export async function deleteRequest<T>({
  path,
  filterOptions,
  headers = "application/json",
}: {
  path: string;
  filterOptions?: FilterOptions;
  headers?: string;
}): Promise<T> {
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
    return res.data;
  });
}
// axios helper
export function buildQuery(
  input: Record<string, string | number | boolean | string[] | object>,
) {
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
      if (apiMsg) throw new Error(apiMsg);
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
}
