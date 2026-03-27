import z from "zod";
import { validUuidParams } from "./global.zod";

export const createTicketInput = {
  bodySchema: z
    .object({
      subject: z.string(),
      description: z.string(),
      email: z.string(),
    })
    .strict(),
};
export const updateTicketStatusInput = {
  bodySchema: z
    .object({
      status: z.enum(["OPEN", "IN_PROGRESS", "ON_HOLD", "RESOLVED", "REOPENED", "CLOSED"]),
    })
    .strict(),
  ...validUuidParams,
};
export const updateTicketPriorityInput = {
  bodySchema: z
    .object({
      priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
    })
    .strict(),
  ...validUuidParams,
};
export const createTicketCommentInput = {
  bodySchema: z
    .object({
      comment: z.string(),
      isInternal: z.boolean(),
    })
    .strict(),
  ...validUuidParams,
};
export const assignTicketInput = {
  bodySchema: z.object({
    assignId: z.uuid(),
    targetType: z.enum(["AGENT", "QUEUE"]),
  }).strict(),
  ...validUuidParams,
};
export type CreateTicketInput = z.infer<typeof createTicketInput.bodySchema>;
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusInput.bodySchema>;
export type UpdateTicketPriorityInput = z.infer<typeof updateTicketPriorityInput.bodySchema>;
export type CreateTicketCommentInput = z.infer<typeof createTicketCommentInput.bodySchema>;
export type AssignTicketInput = z.infer<typeof assignTicketInput.bodySchema>;
