import { z } from "zod";
import { validUuidParams } from "./global.zod";
import { validBigDescription, validEmail, validString } from "./helper/zodHelper";

export const createTicketInput = {
  bodySchema: z
    .object({
      subject: validString,
      description: validBigDescription,
      email: validEmail,
      priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
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
      status: z.enum(["OPEN", "CLOSED", "IN_PROGRESS", "ON_HOLD", "RESOLVED", "REOPENED"]),
      priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
      category: z.string().min(1, "Category is required"),
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
      assignId: z.string().uuid("Invalid Assignment ID"),
      targetType: z.enum(["AGENT", "QUEUE"]),
    })
    .strict(),
  ...validUuidParams,
};

// Enums
const TicketStatusEnum = z.enum([
  "OPEN",
  "CLOSED",
  "IN_PROGRESS",
  "ON_HOLD",
  "RESOLVED",
  "REOPENED",
  "CLOSED",
]);
const TicketPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
// const TicketCategoryEnum = z.enum(["billing", "technical", "general"]);

// Nested user schema
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
  status: TicketStatusEnum,
  priority: TicketPriorityEnum,
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
export type TicketSchemaResponse = z.infer<typeof ticketSchemaResponse>;
export type CreateTicketInput = z.infer<typeof createTicketInput.bodySchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketInput.bodySchema>;
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusInput.bodySchema>;
export type UpdateTicketPriorityInput = z.infer<typeof updateTicketPriorityInput.bodySchema>;
export type CreateTicketCommentInput = z.infer<typeof createTicketCommentInput.bodySchema>;
export type AssignTicketInput = z.infer<typeof assignTicketInput.bodySchema>;
