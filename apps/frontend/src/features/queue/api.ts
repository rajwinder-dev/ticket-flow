import { deleteRequest, getRequestMany, patchRequest, postRequest } from "@/utils/axis";
import {
  type CreateQueueInput,
  type QueueSchemaResponse,
  type UpdateQueueInput,
} from "@repo/schemas";

export const queueApi = {
  getByGroupId: async (groupId: string) => {
    const res = await getRequestMany<QueueSchemaResponse>({
      path: `/queue/${groupId}`,
    });
    return res;
  },
  create: async (groupId: string, data: CreateQueueInput) => {
    const res = await postRequest({
      path: `/queue/${groupId}`,
      data,
    });
    return res;
  },
  update: async (queueId: string, data: UpdateQueueInput) => {
    const res = await patchRequest({
      path: `/queue/${queueId}`,
      data,
    });
    return res;
  },
  delete: async (queueId: string) => {
    const res = await deleteRequest({
      path: `/queue/${queueId}`,
    });
    return res;
  },
  addAgents: async (queueId: string, agentIds: string[]) => {
    const res = await postRequest({
      path: `/queue/${queueId}/agents`,
      data: {
        agentIds,
      },
    });
    return res;
  },
  removeAgents: async (queueId: string, agentIds: string[]) => {
    const res = await patchRequest({
      path: `/queue/${queueId}/agents`,
      data: {
        agentIds,
      },
    });
    return res;
  },
  getAgents: async (queueId: string) => {
    const res = await getRequestMany({
      path: `/queue/${queueId}/agents`,
    });
    return res;
  },
};
