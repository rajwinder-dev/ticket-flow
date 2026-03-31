import type { DepartmentData } from "../types/departmentTypes";
import type { ApiResponse, PaginateResponse } from "../types/genetic";
import { deleteRequest, getRequest, postRequest } from "../utils/axis";

export async function getAllDepartments() {
  const { data, error } = await getRequest({
    path: "/department",
  });
  if (error) throw new Error(error);
  const response = data as PaginateResponse<DepartmentData>;
  if (response.status !== "success") throw new Error("Api return failed ");
  return response;
}

export async function createDepartment(department: string) {
  const { data, error } = await postRequest({
    data: { department },
    path: "/department",
  });
  if (error) throw new Error(error);
  const response = data as ApiResponse<DepartmentData>;
  if (response.status !== "success") throw new Error("Api return failed ");
  return response.data;
}

export async function deleteDepartment(departmentId: string) {
  const { data, error } = await deleteRequest({
    path: `/department/${departmentId}`,
  });
  if (error) throw new Error(error);
  const response = data as ApiResponse<DepartmentData>;
  if (response.status !== "success") throw new Error("Api return failed ");
  return response.data;
}
