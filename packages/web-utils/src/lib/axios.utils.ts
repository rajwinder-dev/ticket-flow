import axios, { AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import type {
  ApiResponse,
  FilterOptions,
  geneticApiResponse,
  PaginateResponse,
  PostRequest,
} from './axios.types.js';
export type RequestContext = {
  getOrgId?: () => string | undefined;
};
export class AxiosApi {
  apiUrl: string;
  api: AxiosInstance;
  private context: RequestContext = {};
  constructor({
    apiUrl = '/api/v1',
  }: {
    apiUrl?: string;
  } = {}) {
    this.context = {};
    this.apiUrl = apiUrl;

    this.api = axios.create({
      baseURL: this.apiUrl,
      withCredentials: true,
    });
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const organizationId = this.context.getOrgId?.();
        if (organizationId)
          config.headers['x-organization-id'] = organizationId;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }
  setContext(context: RequestContext) {
    this.context = context;
  }
  async post<T = geneticApiResponse>({
    path,
    data,
    headers = 'application/json',
    options,
  }: PostRequest): Promise<ApiResponse<T>> {
    return await this.catchError(async () => {
      const response = await this.api.post<ApiResponse<T>>(`${path}`, data, {
        headers: {
          'Content-Type': headers,
        },
        ...(options || {}),
      });
      const res = response.data;
      return res;
    });
  }
  async get<T = geneticApiResponse>({
    path,
    filterOptions,
    headers = 'application/json',
  }: {
    path: string;
    filterOptions?: FilterOptions;
    headers?: string;
  }): Promise<ApiResponse<T>> {
    return await this.catchError(async () => {
      let query = '';
      if (filterOptions) query = this.buildQuery(filterOptions);
      const response = await this.api.get<ApiResponse<T>>(`${path}?${query}`, {
        headers: {
          'Content-Type': headers,
        },
      });
      const res = response.data;
      if (res.status === 'fail') throw new Error(res.message);

      return res;
    });
  }
  async getMany<T>({
    path,
    filterOptions,
    headers = 'application/json',
  }: {
    path: string;
    filterOptions?: FilterOptions;
    headers?: string;
  }): Promise<PaginateResponse<T>> {
    return await this.catchError(async () => {
      let query = '';
      if (filterOptions) query = this.buildQuery(filterOptions);
      const response = await this.api.get<PaginateResponse<T>>(
        `${path}?${query}`,
        {
          headers: {
            'Content-Type': headers,
          },
        },
      );
      const res = response.data;
      if (res.status === 'fail') throw new Error(res.message);
      return res;
    });
  }
  async patch<T = geneticApiResponse>({
    path,
    data,
    headers = 'application/json',
  }: PostRequest): Promise<ApiResponse<T>> {
    return await this.catchError(async () => {
      const response = await this.api.patch<ApiResponse<T>>(`${path}`, data, {
        headers: {
          'Content-Type': headers,
        },
      });
      const res = response.data;
      if (res.status === 'fail') throw new Error(res.message);
      return res;
    });
  }
  async delete<T = geneticApiResponse>({
    path,
    filterOptions,
    headers = 'application/json',
  }: {
    path: string;
    filterOptions?: FilterOptions;
    headers?: string;
  }): Promise<ApiResponse<T>> {
    let query = '';
    if (filterOptions) query = this.buildQuery(filterOptions);
    return await this.catchError(async () => {
      const response = await this.api.delete<ApiResponse<T>>(
        `${path}?${query}`,
        {
          headers: {
            'Content-Type': headers,
          },
        },
      );
      const res = response.data;
      if (res.status === 'fail') throw new Error(res.message);
      return res;
    });
  }
  buildQuery(
    input: Record<string, string | number | boolean | string[] | object>,
  ) {
    const array: string[] = [];
    for (const [key, value] of Object.entries(input)) {
      if (Array.isArray(value)) {
        array.push(`${key}=${value.join(',')}`);
      } else if (typeof value === 'object' && value !== null) {
        for (const [key, subValue] of Object.entries(value)) {
          array.push(`${key}=${subValue}`);
        }
      } else {
        array.push(`${key}=${value}`);
      }
    }
    return array.join('&');
  }
  async catchError<T>(callback: () => Promise<T>): Promise<T> {
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
      const unknownError = new Error('Unknown error occurred');
      throw unknownError;
    }
  }
}

// axios helper

export * from './axios.types.js';
