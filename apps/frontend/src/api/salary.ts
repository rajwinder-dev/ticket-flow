import type { FilterOptions } from "../types/genetic";
import { type CreateSalary, type SalaryDetails } from "../types/salaryTypes";
import { getRequest, getRequestMany, postRequest } from "../utils/axis";

export async function CreateSalary(input: CreateSalary) {
  const data = await postRequest<SalaryDetails>({
    path: "/salary",
    data: input,
  });
  return data;
}
export async function getAllSalaries({
  filterOptions,
}: {
  filterOptions: FilterOptions;
}) {
  const data = await getRequestMany<SalaryDetails>({
    path: "/salary",
    filterOptions,
  });
  return data;
}
export async function getEmployeeSalaries({
  employeeId,
  filterOptions,
}: {
  employeeId: number;
  filterOptions: FilterOptions;
}) {
  const data = await getRequestMany<SalaryDetails>({
    path: `/salary/${employeeId}`,
    filterOptions,
  });
  return data;
}
export async function getSalaryDetails(salaryId: number) {
  const data = await getRequest<SalaryDetails>({
    path: `/salary/${salaryId}`,
  });
  return data;
}
export async function getMySalary() {
  const data = await getRequestMany<SalaryDetails>({
    path: `/salary/me`,
  });
  return data;
}
export async function getSalarySummary() {
  const data = await getRequest<SalaryDetails>({
    path: `/salary/summary`,
  });
  return data;
}
