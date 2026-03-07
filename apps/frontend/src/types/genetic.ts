export type PaginateResponse<T> = {
  status: string;
  message?: string;
  offset: number;
  limit: number;
  total: number;
  data: T[];
};
export type ApiResponse<T> = {
  status: string;
  message?: string;
  data: T;
  timestamp: string;
};

export type FilterOptions = {
  limit: number;
  offset: number;
  sorting?: { sortby: string; sortOrder?: "asc" | "desc" };
  filter?: Record<string, string | number>;
  fields?: string[];
};
