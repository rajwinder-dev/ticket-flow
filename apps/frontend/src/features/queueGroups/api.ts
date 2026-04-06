import { deleteRequest, getRequestMany, patchRequest, postRequest } from "@/utils/axis";
import { type QueueGroupSchemaResponse, type CreateQueueGroupInput } from "@repo/schemas";

const queueGroupApi = {
  create: async (data: CreateQueueGroupInput) => {
    const res = await postRequest({
      path: "/queue-group",
      data,
    });
    return res;
  },
  delete: async (id: string) => {
    const res = await deleteRequest({
      path: `/queue-group/${id}`,
    });
    return res;
  },
  getAll: async () => {
    const res = await getRequestMany<QueueGroupSchemaResponse>({
      path: "/queue-group",
    });
    return res;
  },
  update: async (id: string , data: CreateQueueGroupInput) => {
    const res = await patchRequest({
      path: `/queue-group/${id}`,
      data,
    });
    return res;
  },
  setDefault: async (id: string) => {
    const res = await patchRequest({
      path: `/queue-group/${id}/default"`,
    });
    return res;
  },
};

export default queueGroupApi;
