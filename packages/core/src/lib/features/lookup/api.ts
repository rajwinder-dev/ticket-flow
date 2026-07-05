import type { LookupSchema } from "@org/zod";
import { api } from "../../api.js";

export const lookupApi = {
  getGroups: async () => {
    return await api.getMany<LookupSchema>({ path: "/lookup/groups" });
  },
  getQueues: async (groupId: string) => {
    return await api.getMany<LookupSchema>({ path: `/lookup/queues/${groupId}` });
  },
  getAgents: async (queueId: string) => {
    return await api.getMany<LookupSchema>({ path: `/lookup/agents/${queueId}` });
  },
  getRoles: async () => {
    return await api.getMany<LookupSchema>({ path: `/lookup/roles` });
  },
};
