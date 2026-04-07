import { z } from "zod";
import { validBigDescription, validDescription, validString } from "./helper/zodHelper";

// --- Queue Groups ---

export const createQueueGroupInput = {
  bodySchema: z
    .object({
      name: validString,
      description: validDescription.optional(),
      isDefault: z.boolean(),
    })
    .strict(),
};

// --- Queues ---

export const createQueueInput = {
  bodySchema: z
    .object({
      name: validString,
      description: validBigDescription.optional(),
    })
    .strict(),
};

export const updateQueueInput = {
  bodySchema: z
    .object({
      name: validString,
      description: validBigDescription.optional(),
    })
    .strict(),
};

// --- Agent Management ---

// Normalized to use UUID for both to maintain consistency
export const addAgentsToQueueInput = {
  bodySchema: z
    .object({
      agentIds: z
        .array(z.string().uuid("Each Agent ID must be a valid UUID"))
        .min(1, "At least one agent ID is required"),
    })
    .strict(),
};

export const removeAgentsFromQueueInput = {
  bodySchema: z
    .object({
      agentIds: z
        .array(z.string().uuid("Each Agent ID must be a valid UUID"))
        .min(1, "At least one agent ID is required"),
    })
    .strict(),
};
export const queueGroupSchemaResponse = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  queueCount: z.number(),
  queueAgentsCount: z.number(),
  default: z.boolean(),
});
export const queueSchemaResponse = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  order: z.number(),
  agentsCount: z.number(),
  ticketsCount: z.number(),
  createdAt: z.date(),
});
// --- Inferred Types ---
export type QueueGroupSchemaResponse = z.infer<typeof queueGroupSchemaResponse>;
export type QueueSchemaResponse = z.infer<typeof queueSchemaResponse>;
export type CreateQueueGroupInput = z.infer<typeof createQueueGroupInput.bodySchema>;
export type CreateQueueInput = z.infer<typeof createQueueInput.bodySchema>;
export type UpdateQueueInput = z.infer<typeof updateQueueInput.bodySchema>;
export type AddAgentsToQueueInput = z.infer<typeof addAgentsToQueueInput.bodySchema>;
export type RemoveAgentsFromQueueInput = z.infer<typeof removeAgentsFromQueueInput.bodySchema>;
