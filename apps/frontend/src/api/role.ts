import type { FilterOptions } from "../types/genetic";
import type { CreateRole, RoleDetails } from "../types/roleTypes";
import {
  deleteRequest,
  getRequest,
  getRequestMany,
  patchRequest,
  postRequest,
} from "../utils/axis";

export async function CreateRole(input: CreateRole) {
  const data = await postRequest<RoleDetails>({
    path: "/role",
    data: input,
  });
  return data;
}
export async function updateRole(input: { description: true }) {
  const data = await patchRequest<RoleDetails>({
    path: "/role",
    data: input,
  });
  return data;
}
export async function GetAllRoles({
  filterOptions,
}: {
  filterOptions: FilterOptions;
}) {
  const data = await getRequestMany<RoleDetails>({
    path: "/role",
    filterOptions,
  });
  return data;
}
export async function getRole(roleId: number) {
  const data = await getRequest<RoleDetails>({
    path: `/role/${roleId}`,
  });
  return data;
}
export async function deleteRole(roleId: number) {
  const data = await deleteRequest({
    path: `/role/${roleId}`,
  });
  return data;
}
