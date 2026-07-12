import {
  type CreateQueueInput,
  type QueueDetailsSchema,
  type QueueSchemaResponse,
  type QueueSummarySchema,
  type UpdateQueueInput,
} from "@org/zod";
import { api } from "../../api.js";

export const queueApi = {
  getByGroupId: async (groupId: string) => {
    const res = await api.getMany<QueueSchemaResponse>({
      path: `/queue/${groupId}`,
    });
    return res;
  },
  getDetails: async (queueId: string) => {
    const res = await api.get<QueueDetailsSchema>({
      path: `/queue/${queueId}/details`,
    });
    return res;
  },
  getSummary: async (queueId: string) => {
    const res = await api.get<QueueSummarySchema>({
      path: `/queue/${queueId}/summary`,
    });
    return res;
  },
  create: async (groupId: string, data: CreateQueueInput) => {
    const res = await api.post({
      path: `/queue/${groupId}`,
      data,
    });
    return res;
  },
  update: async (queueId: string, data: UpdateQueueInput) => {
    const res = await api.patch({
      path: `/queue/${queueId}`,
      data,
    });
    return res;
  },
  delete: async (queueId: string) => {
    const res = await api.delete({
      path: `/queue/${queueId}`,
    });
    return res;
  },
  addAgents: async (queueId: string, agentIds: string[]) => {
    const res = await api.post({
      path: `/queue/${queueId}/agents`,
      data: {
        agentIds,
      },
    });
    return res;
  },
  removeAgents: async (queueId: string, agentIds: string[]) => {
    const res = await api.patch({
      path: `/queue/${queueId}/agents`,
      data: {
        agentIds,
      },
    });
    return res;
  },
  getAgents: async (queueId: string) => {
    const res = await api.getMany({
      path: `/queue/${queueId}/agents`,
    });
    return res;
  },
};
