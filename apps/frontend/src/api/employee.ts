import type {
  EmployeeRecords,
  EmployeesDetails,
  updateDetails,
} from "../types/employeeTypes";
import type { FilterOptions } from "../types/genetic";
import {
  getRequest,
  getRequestMany,
  patchRequest,
  postRequest,
} from "../utils/axis";
// Admin routes
export async function getAllEmployees({
  filterOptions,
}: {
  filterOptions: FilterOptions;
}) {
  const data = await getRequestMany<EmployeeRecords>({
    path: `/employee`,
    filterOptions: filterOptions,
  });
  return data;
}

export async function getEmployee(id: number) {
  const data = await getRequest<EmployeesDetails>({
    path: `/employee/${id}`,
  });

  return data;
}

export async function createEmployee(input: EmployeesDetails) {
  const data = await postRequest<EmployeesDetails>({
    path: `/employee`,
    data: input,
  });

  return data;
}

export async function updateDetails(input: updateDetails, empId: number) {
  const data = await patchRequest({
    path: `/employee/${empId}`,
    data: input,
  });

  return data;
}
export async function getMyDetails() {
  const data = await getRequest<EmployeesDetails>({
    path: `/employee/me`,
  });
  return data;
}
export async function updateMyDetails(input: updateDetails) {
  const data = await patchRequest({
    path: `/employee/updateMe`,
    data: input,
  });
  return data;
}
