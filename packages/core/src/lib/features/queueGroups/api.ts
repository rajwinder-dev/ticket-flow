import { type QueueGroupSchemaResponse, type CreateQueueGroupInput } from "@org/zod";
import { api } from "../../api.js";

const queueGroupApi = {
  create: async (data: CreateQueueGroupInput) => {
    const res = await api.post({
      path: "/queue-group",
      data,
    });
    return res;
  },
  delete: async (id: string) => {
    const res = await api.delete({
      path: `/queue-group/${id}`,
    });
    return res;
  },
  getAll: async () => {
    const res = await api.getMany<QueueGroupSchemaResponse>({
      path: "/queue-group",
    });
    return res;
  },
  update: async (id: string , data: CreateQueueGroupInput) => {
    const res = await api.patch({
      path: `/queue-group/${id}`,
      data,
    });
    return res;
  },
  setDefault: async (id: string) => {
    const res = await api.patch({
      path: `/queue-group/${id}/default"`,
    });
    return res;
  },
};

export default queueGroupApi;
