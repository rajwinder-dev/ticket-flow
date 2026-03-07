import { type AttendanceDetails } from "../types/attendanceTypes";
import type { FilterOptions } from "../types/genetic";
import { getRequestMany, postRequest } from "../utils/axis";

export async function markAttendance() {
  const data = await postRequest({
    path: "/attend",
    data: null,
  });
  return data;
}
export async function getAllAttendance({
  filterOptions,
}: {
  filterOptions: FilterOptions;
}) {
  const data = await getRequestMany<AttendanceDetails>({
    path: "/attend",
    filterOptions,
  });
  return data;
}
export async function getEmployeeAttendance({
  employeeId,
  filterOptions,
}: {
  employeeId: number;
  filterOptions: FilterOptions;
}) {
  const data = await getRequestMany<AttendanceDetails>({
    path: `/attend/${employeeId}`,
    filterOptions,
  });
  return data;
}
export async function getMyAttendance({
  filterOptions,
}: {
  employeeId: number;
  filterOptions: FilterOptions;
}) {
  const data = await getRequestMany<AttendanceDetails>({
    path: `/attend/me`,
    filterOptions,
  });
  return data;
}
