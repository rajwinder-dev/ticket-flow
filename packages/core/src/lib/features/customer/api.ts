import type { FilterOptions } from "@org/web-utils";
import { getRequestMany, patchRequest, postRequest } from "@org/web-utils";
import type {
  CreateCustomerInput,
  CustomerSchemaResponse,
  UpdateCustomerInput,
} from "@org/zod";

export const customerApi = {
  getAll: async (filterOptions?: FilterOptions) => {
  
    const res = await getRequestMany<CustomerSchemaResponse>({
      path: "/customer",
      filterOptions,
    });
    return res;
  },
  create: async (data: CreateCustomerInput) => {
    const res = await postRequest({
      path: "/customer",
      data,
    });
    return res;
  },
  update: async (id: string, data: UpdateCustomerInput) => {
    const res = await patchRequest({
      path: `/customer/${id}`,
      data,
    });
    return res;
  },
};
