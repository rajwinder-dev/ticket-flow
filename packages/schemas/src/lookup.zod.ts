import z from "zod";

export const lookupSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});
export type LookupSchema = z.infer<typeof lookupSchema>;
