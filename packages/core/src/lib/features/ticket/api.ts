import type { FilterOptions } from "@org/web-utils";
import {
  type AssignTicketInput,
  type CommentSchemaResponse,
  type CreateTicketCommentInput,
  type CreateTicketInput,
  type EscalateTicketInput,
  type TicketDetailsSchema,
  type TicketEscalationOptions,
  type TicketSchemaResponse,
  type TicketSummary,
  type TicketTransitionSchema,
  type UpdateTicketInput,
  type UpdateTicketPriorityInput,
  type UpdateTicketStatusInput,
} from "@org/zod";
import { api } from "../../api.js";

export const ticketApi = {
  create: async (data: CreateTicketInput) => {
    const res = await api.post({
      path: "/ticket",
      data,
    });
    return res;
  },
  getAll: async (filterOptions?: FilterOptions) => {
    const res = await api.getMany<TicketSchemaResponse>({
      path: "/ticket",
      filterOptions,
    });
    return res;
  },
  getSummary: async (filterOptions?: FilterOptions) => {
    const res = await api.get<TicketSummary>({
      path: `/ticket/summary`,
      filterOptions,
    });
    return res;
  },
  getAssigned: async () => {
    const res = await api.getMany({
      path: "/ticket/me",
    });
    return res;
  },
  getDetails: async (ticketId: string) => {
    const res = await api.get<TicketDetailsSchema>({
      path: `/ticket/${ticketId}`,
    });
    return res;
  },
  update: async (ticketId: string, data: UpdateTicketInput) => {
    const res = await api.patch({
      path: `/ticket/${ticketId}`,
      data,
    });
    return res;
  },
  updateStatus: async (ticketId: string, data: UpdateTicketStatusInput) => {
    const res = await api.patch({
      path: `/ticket/${ticketId}/status`,
      data,
    });
    return res;
  },
  updatePriority: async (ticketId: string, data: UpdateTicketPriorityInput) => {
    const res = await api.patch({
      path: `/ticket/${ticketId}/priority`,
      data,
    });
    return res;
  },
  assignTicket: async (ticketId: string, data: AssignTicketInput) => {
    const res = await api.patch({
      path: `/ticket/${ticketId}`,
      data,
    });
    return res;
  },
  comment: async (ticketId: string, data: CreateTicketCommentInput) => {
    const res = await api.post({
      path: `/ticket/${ticketId}/comment`,
      data,
    });
    return res;
  },
  getComments: async (ticketId: string) => {
    const res = await api.getMany<CommentSchemaResponse>({
      path: `/ticket/${ticketId}/comment`,
    });
    return res;
  },
  escalate: async (ticketId: string, data: EscalateTicketInput) => {
    const res = await api.post({
      path: `/ticket/${ticketId}/escalate`,
      data,
    });
    return res;
  },
  escalateOptions: async (ticketId: string) => {
    const res = await api.get<TicketEscalationOptions>({
      path: `/ticket/${ticketId}/escalate-options`,
    });
    return res;
  },
  getTransitionHistory: async (ticketId: string) => {
    const res = await api.getMany<TicketTransitionSchema>({
      path: `/ticket/${ticketId}/transition-history`,
    });
    return res;
  },
};
