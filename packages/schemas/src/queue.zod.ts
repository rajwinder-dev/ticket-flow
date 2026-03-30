import { z } from "zod";
import {
  validString,
  validDescription,
  validBigDescription
} from "./helper/zodHelper";

// --- Queue Groups ---

export const createQueueGroupInput = {
  bodySchema: z
    .object({
      name: validString,
      description: validDescription.optional(),
    })
    .strict(),
};

// --- Queues ---

export const createQueueInput = {
  bodySchema: z
    .object({
      name: validString,
      description: validBigDescription.optional(),
      // SLAs: Ensure these are reasonable numbers (e.g., max 1 week in minutes)
      firstResponseTimeMinutes: z.number().int().positive().max(10080),
      resolutionTimeMinutes: z.number().int().positive().max(10080),
      nextQueueId: z.string().uuid("Invalid Queue ID").optional(),
    })
    .strict(),
};

export const updateQueueInput = {
  bodySchema: z
    .object({
      // Added name so it's actually editable
      name: validString.optional(),
      description: validBigDescription.optional(),
      firstResponseTimeMinutes: z.number().int().positive().optional(),
      resolutionTimeMinutes: z.number().int().positive().optional(),
      nextQueueId: z.string().uuid().optional(),
    })
    .strict(),
};

// --- Agent Management ---

// Normalized to use UUID for both to maintain consistency
export const addAgentsToQueueInput = {
  bodySchema: z
    .object({
      agentIds: z.array(z.string().uuid("Each Agent ID must be a valid UUID")).min(1, "At least one agent ID is required"),
    })
    .strict(),
};

export const removeAgentsFromQueueInput = {
  bodySchema: z
    .object({
      agentIds: z.array(z.string().uuid("Each Agent ID must be a valid UUID")).min(1, "At least one agent ID is required"),
    })
    .strict(),
};

// --- Inferred Types ---
export type CreateQueueGroupInput = z.infer<typeof createQueueGroupInput.bodySchema>;
export type CreateQueueInput = z.infer<typeof createQueueInput.bodySchema>;
export type UpdateQueueInput = z.infer<typeof updateQueueInput.bodySchema>;
export type AddAgentsToQueueInput = z.infer<typeof addAgentsToQueueInput.bodySchema>;
export type RemoveAgentsFromQueueInput = z.infer<typeof removeAgentsFromQueueInput.bodySchema>;
