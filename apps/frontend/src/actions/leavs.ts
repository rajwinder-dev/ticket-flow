import type { FilterOptions } from "../types/genetic";
import {
  type LeaveDetails,
  type CreateLeave,
  type LeaveSummary,
} from "../types/leavesTypes";
import { getRequest, getRequestMany, postRequest } from "../utils/axis";

export async function createLeave(input: CreateLeave) {
  const data = await postRequest<LeaveDetails>({
    path: "/leave/me",
    data: input,
  });
  return data;
}
export async function updateLeave(input: { status: "approved" | "rejected" }) {
  const data = await postRequest<LeaveDetails>({
    path: "/leave/me",
    data: input,
  });
  return data;
}
export async function getSelfLeaves({
  filterOptions,
}: {
  filterOptions: FilterOptions;
}) {
  const data = await getRequestMany<LeaveDetails>({
    path: "/leave/me",
    filterOptions,
  });
  return data;
}
export async function getAllLeaves({
  filterOptions,
}: {
  filterOptions: FilterOptions;
}) {
  const data = await getRequestMany<LeaveDetails>({
    path: "/leave",
    filterOptions,
  });
  return data;
}

export async function getEmployeeLeaves({
  employeeId,
  filterOptions,
}: {
  filterOptions: FilterOptions;
  employeeId: number;
}) {
  const data = await getRequestMany<LeaveDetails>({
    path: `/leave/${employeeId}`,
    filterOptions,
  });
  return data;
}

export async function getLeaveSummary() {
  const data = await getRequest<LeaveSummary>({
    path: `/leave/summary`,
  });
  return data;
}
