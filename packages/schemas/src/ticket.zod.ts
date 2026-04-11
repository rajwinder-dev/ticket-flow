import { z } from "zod";
import { validUuidParams } from "./global.zod";
import { validBigDescription, validEmail, validString } from "./helper/zodHelper";

export const ticketPriority = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export const ticketStatus = [
  "OPEN",
  "CLOSED",
  "IN_PROGRESS",
  "ON_HOLD",
  "RESOLVED",
  "REOPENED",
  "ESCALATED"
] as const;
export const ticketCategory = ["BUG", "FEATURE", "TASK", "DOCS"] as const;
export const allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ["IN_PROGRESS", "CLOSED"],
  ESCALATED: ["IN_PROGRESS", "CLOSED"],
  IN_PROGRESS: ["RESOLVED", "ON_HOLD"],
  ON_HOLD: ["IN_PROGRESS"],
  RESOLVED: ["CLOSED", "REOPENED"],
  REOPENED: ["IN_PROGRESS"],
  CLOSED: ["REOPENED"],
};

export const createTicketInput = {
  bodySchema: z
    .object({
      subject: validString,
      description: validBigDescription,
      email: validEmail,
      priority: z.enum(ticketPriority),
      category: validString,
      assignment: z
        .object({
          groupId: z.uuid().optional(),
          queueId: z.uuid().optional(),
          agentId: z.uuid().optional(),
        })
        .optional(),
    })
    .strict(),
};
export const updateTicketInput = {
  bodySchema: z
    .object({
      subject: z.string().min(2, "Subject is required"),
      description: z.string().optional(),
      priority: z.enum(ticketPriority),
      category: z.string().min(1, "Category is required"),
    })
    .strict(),
};
export const updateTicketStatusInput = {
  bodySchema: z
    .object({
      status: z.enum(ticketStatus),
    })
    .strict(),
  ...validUuidParams,
};

export const updateTicketPriorityInput = {
  bodySchema: z
    .object({
      priority: z.enum(ticketPriority),
    })
    .strict(),
  ...validUuidParams,
};

export const createTicketCommentInput = {
  bodySchema: z
    .object({
      // Using trim and min(1) to prevent empty comments
      comment: z.string().trim().min(1, "Comment cannot be empty"),
      isInternal: z.boolean().default(false),
    })
    .strict(),
  ...validUuidParams,
};

export const assignTicketInput = {
  bodySchema: z
    .object({
      assignId: z.uuid("Invalid Assignment ID"),
      targetType: z.enum(["AGENT", "QUEUE"]),
    })
    .strict(),
  ...validUuidParams,
};
const AssignedToUserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1),
});

// Main ticket schema
export const ticketSchemaResponse = z.object({
  id: z.string().uuid(),
  code: z.string().trim().min(1),
  subject: z.string().min(1),
  category: z.string(),
  description: z.string().optional(),
  status: z.enum(ticketStatus),
  priority: z.enum(ticketPriority),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  organizationId: z.uuid(),
  queueId: z.uuid(),
  customerId: z.uuid(),
  assignedTo: z.uuid(),
  assignedBy: z.uuid().nullable(),
  assignedToUser: AssignedToUserSchema,
});
// --- Inferred Types ---
export type TicketPriority = (typeof ticketPriority)[number];
export type TicketStatus = (typeof ticketStatus)[number];
export type TicketCategory = (typeof ticketCategory)[number];
export type TicketSchemaResponse = z.infer<typeof ticketSchemaResponse>;
export type CreateTicketInput = z.infer<typeof createTicketInput.bodySchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketInput.bodySchema>;
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusInput.bodySchema>;
export type UpdateTicketPriorityInput = z.infer<typeof updateTicketPriorityInput.bodySchema>;
export type CreateTicketCommentInput = z.infer<typeof createTicketCommentInput.bodySchema>;
export type AssignTicketInput = z.infer<typeof assignTicketInput.bodySchema>;
