import { z } from "zod";

export const validUuidParams = {
  paramsSchema: z
    .object({
      id: z.uuid(),
    })
    .strict(),
};
export const cryptoType = z.object({
  iv: z.string(),
  content: z.string(),
  tag: z.string(),
});
export type CryptoType = z.infer<typeof cryptoType>;
