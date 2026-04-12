import { getRequest, getRequestMany, patchRequest, postRequest } from "@/utils/axis";
import type {
  AssignTicketInput,
  CreateTicketCommentInput,
  CreateTicketInput,
  EscalateTicketInput,
  TicketEscalationOptions,
  TicketSchemaResponse,
  TicketSummary,
  UpdateTicketInput,
  UpdateTicketPriorityInput,
  UpdateTicketStatusInput,
} from "@repo/schemas";

export const ticketApi = {
  create: async (data: CreateTicketInput) => {
    const res = await postRequest({
      path: "/ticket",
      data,
    });
    return res;
  },
  getAll: async () => {
    const res = await getRequestMany<TicketSchemaResponse>({
      path: "/ticket",
    });
    return res;
  },
  getSummary: async () => {
    const res = await getRequest<TicketSummary>({
      path: `/ticket/summary`,
    });
    return res;
  },
  getAssigned: async () => {
    const res = await getRequestMany({
      path: "/ticket/me",
    });
    return res;
  },
  getDetails: async (ticketId: string) => {
    const res = await getRequest({
      path: `/ticket/${ticketId}`,
    });
    return res;
  },
  update: async (ticketId: string, data: UpdateTicketInput) => {
    const res = await patchRequest({
      path: `/ticket/${ticketId}`,
      data,
    });
    return res;
  },
  updateStatus: async (ticketId: string, data: UpdateTicketStatusInput) => {
    const res = await patchRequest({
      path: `/ticket/${ticketId}/status`,
      data,
    });
    return res;
  },
  updatePriority: async (ticketId: string, data: UpdateTicketPriorityInput) => {
    const res = await patchRequest({
      path: `/ticket/${ticketId}/priority`,
      data,
    });
    return res;
  },
  assignTicket: async (ticketId: string, data: AssignTicketInput) => {
    const res = await patchRequest({
      path: `/ticket/${ticketId}`,
      data,
    });
    return res;
  },
  comment: async (ticketId: string, data: CreateTicketCommentInput) => {
    const res = await postRequest({
      path: `/ticket/${ticketId}/comment`,
      data,
    });
    return res;
  },
  escalate: async (ticketId: string, data: EscalateTicketInput) => {
    const res = await postRequest({
      path: `/ticket/${ticketId}/escalate`,
      data,
    });
    return res;
  },
  escalateOptions: async (ticketId: string) => {
    const res = await getRequest<TicketEscalationOptions>({
      path: `/ticket/${ticketId}/escalate-options`,
    });
    return res;
  },
};
