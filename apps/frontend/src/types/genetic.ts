export type PaginateResponse<T> = {
  status: string;
  message?: string;
  offset: number;
  limit: number;
  total: number;
  data: T[];
};
export type geneticApiResponse = {
  status: string;
  message?: string;
  code?: string;
  timestamp: string;
};
export interface ApiResponse<T> extends geneticApiResponse {
  data: T;
}

export type FilterOptions = {
  limit: number;
  offset: number;
  sorting?: { sortby: string; sortOrder?: "asc" | "desc" };
  filter?: Record<string, string | number>;
  fields?: string[];
};
export interface ApiMessage {
  message: string;
}
