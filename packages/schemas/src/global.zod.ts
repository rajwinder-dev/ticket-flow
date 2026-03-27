import { z } from "zod";

export const validUuidParams = {
  paramsSchema: z
    .object({
      id: z.uuid(),
    })
    .strict(),
};
