import { deleteRequest, getRequest, getRequestMany, patchRequest, postRequest } from "@org/utils";
import type { CreateRoleInput, RoleSchema, UpdateRoleInput } from "@org/zod";

export const roleApi = {
  getAllRoles: async () => {
    const res = await getRequestMany<RoleSchema>({ path: "/role" });
    return res;
  },
  getDetails: async (id: string) => {
    const res = await getRequest<RoleSchema>({ path: `/role/${id}` });
    return res;
  },
  create: async (data: CreateRoleInput) => {
    const res = await postRequest({ path: "/role", data });
    return res;
  },

  update: async (id: string, data: UpdateRoleInput) => {
    const res = await patchRequest({ path: `/role/${id}`, data });
    return res;
  },
  delete: async (id: string) => {
    const res = await deleteRequest({ path: `/role/${id}` });
    return res;
  },
};
