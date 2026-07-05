import type { FilterOptions } from "@org/web-utils";
import type {
  CreateCustomerInput,
  CustomerSchemaResponse,
  UpdateCustomerInput,
} from "@org/zod";
import { api } from "../../api.js";

export const customerApi = {
  getAll: async (filterOptions?: FilterOptions) => {
  
    const res = await api.getMany<CustomerSchemaResponse>({
      path: "/customer",
      filterOptions,
    });
    return res;
  },
  create: async (data: CreateCustomerInput) => {
    const res = await api.post({
      path: "/customer",
      data,
    });
    return res;
  },
  update: async (id: string, data: UpdateCustomerInput) => {
    const res = await api.patch({
      path: `/customer/${id}`,
      data,
    });
    return res;
  },
};
