import { getRequestMany, postRequest } from "@/utils/axis";
import type { CreateCustomerInput, UpdateCustomerInput } from "@repo/schemas";

export const customerApi = {
  getAll: async () => {
    const res = await getRequestMany({
      path: "/customer",
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
  update: async (id: string ,data: UpdateCustomerInput) => {
       const res = await postRequest({
      path: `/customer/${id}`,
      data,
    });
    return res;
  }
};

