import type {
  AnnouncementDetails,
  CreateAnnouncement,
} from "../types/announcementTypes";
import type { FilterOptions } from "../types/genetic";
import { getRequestMany, postRequest } from "../utils/axis";

export async function createAnnouncement(input: CreateAnnouncement) {
  const data = await postRequest({
    path: "/announcement",
    data: input,
  });
  return data;
}

export async function getAllAnnouncements({
  filterOptions,
}: {
  filterOptions: FilterOptions;
}) {
  const data = await getRequestMany<AnnouncementDetails>({
    path: "/announcement",
    filterOptions,
  });
  return data;
}
export async function getSelfAnnouncements({
  filterOptions,
}: {
  filterOptions: FilterOptions;
}) {
  const data = await getRequestMany<AnnouncementDetails>({
    path: "/announcement/me",
    filterOptions,
  });
  return data;
}
