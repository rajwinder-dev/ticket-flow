import type { CreateRoleInput, RoleSchema, UpdateRoleInput } from "@org/zod";
import { api } from "../../api.js";

export const roleApi = {
  getAllRoles: async () => {
    const res = await api.getMany<RoleSchema>({ path: "/role" });
    return res;
  },
  getDetails: async (id: string) => {
    const res = await api.get<RoleSchema>({ path: `/role/${id}` });
    return res;
  },
  create: async (data: CreateRoleInput) => {
    const res = await api.post({ path: "/role", data });
    return res;
  },

  update: async (id: string, data: UpdateRoleInput) => {
    const res = await api.patch({ path: `/role/${id}`, data });
    return res;
  },
  delete: async (id: string) => {
    const res = await api.delete({ path: `/role/${id}` });
    return res;
  },
};
