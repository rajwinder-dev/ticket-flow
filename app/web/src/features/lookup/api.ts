import { getRequestMany } from "@/utils/axis";
import type { LookupSchema } from "@org/zod";

export const lookupApi = {
  getGroups: async () => {
    return await getRequestMany<LookupSchema>({ path: "/lookup/groups" });
  },
  getQueues: async (groupId: string) => {
    return await getRequestMany<LookupSchema>({ path: `/lookup/queues/${groupId}` });
  },
  getAgents: async (queueId: string) => {
    return await getRequestMany<LookupSchema>({ path: `/lookup/agents/${queueId}` });
  },
  getRoles: async () => {
    return await getRequestMany<LookupSchema>({ path: `/lookup/roles` });
  },
};
