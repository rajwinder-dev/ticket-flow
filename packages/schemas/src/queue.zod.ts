import z from "zod";

export const createQueueInput = {
  bodySchema: z
    .object({
      name: z.string(),
      description: z.string().optional(),
      firstResponseTimeMinutes: z.number().int().positive(),
      resolutionTimeMinutes: z.number().int().positive(),
    })
    .strict(),
};

export const updateQueueInput = {
  bodySchema: z
    .object({
      description: z.string().optional(),
      firstResponseTimeMinutes: z.number().int().positive().optional(),
      resolutionTimeMinutes: z.number().int().positive().optional(),
    })
    .strict(),
};
export const addAgentsToQueueInput = {
  bodySchema: z.object({
    agentIds: z.array(z.string()),
  }),
};
export const removeAgentsFromQueueInput = {
  bodySchema: z.object({
    agentIds: z.array(z.string()),
  }),
};
export type CreateQueueInput = z.infer<typeof createQueueInput.bodySchema>;
export type UpdateQueueInput = z.infer<typeof updateQueueInput.bodySchema>;
export type AddAgentsToQueueInput = z.infer<typeof addAgentsToQueueInput.bodySchema>;
export type RemoveAgentsFromQueueInput = z.infer<typeof removeAgentsFromQueueInput.bodySchema>;
