import z from "zod";
export const lookupInputGroupId = {
  paramsSchema: z.object({
    groupId: z.uuid(),
  }),
};
export const lookupInputQueueId = {
  paramsSchema: z.object({
    queueId: z.uuid(),
  }),
};
export const lookupSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});
export type LookupSchema = z.infer<typeof lookupSchema>;
