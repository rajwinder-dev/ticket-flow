import { z } from "zod";
import {
  validEmail,
  validString,
  validBigDescription,
} from "./helper/zodHelper";
import { validUuidParams } from "./global.zod";

export const createTicketInput = {
  bodySchema: z
    .object({
      subject: validString, // Trims and enforces 2-50 chars
      description: validBigDescription, // Trims and enforces 10+ chars
      email: validEmail, // Normalizes to lowercase
    })
    .strict(),
};

export const updateTicketStatusInput = {
  bodySchema: z
    .object({
      status: z.enum([
        "OPEN",
        "IN_PROGRESS",
        "ON_HOLD",
        "RESOLVED",
        "REOPENED",
        "CLOSED"
      ]),
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

// --- Inferred Types ---
export type CreateTicketInput = z.infer<typeof createTicketInput.bodySchema>;
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusInput.bodySchema>;
export type UpdateTicketPriorityInput = z.infer<typeof updateTicketPriorityInput.bodySchema>;
export type CreateTicketCommentInput = z.infer<typeof createTicketCommentInput.bodySchema>;
export type AssignTicketInput = z.infer<typeof assignTicketInput.bodySchema>;
