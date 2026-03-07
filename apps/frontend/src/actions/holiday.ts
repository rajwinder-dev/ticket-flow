import type { FilterOptions } from "../types/genetic";
import {
  type HolidaySummary,
  type CreateHoliday,
  type HolidayDetails,
} from "../types/holidayTypes";
import {
  deleteRequest,
  getRequest,
  getRequestMany,
  postRequest,
} from "../utils/axis";

export async function createHoliday(input: CreateHoliday) {
  const data = await postRequest<HolidayDetails>({
    path: "/holiday",
    data: input,
  });
  return data;
}

export async function getAllHolidays({
  filterOptions,
}: {
  filterOptions: FilterOptions;
}) {
  const data = await getRequestMany<HolidayDetails>({
    path: "/holiday",
    filterOptions,
  });
  return data;
}
export async function holidaySummary() {
  const data = await getRequest<HolidaySummary>({
    path: "/holiday/summary",
  });
  return data;
}

export async function deleteHoliday(id: number) {
  const data = await deleteRequest({
    path: `/holiday/${id}`,
  });
  return data;
}
