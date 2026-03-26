import { z } from "zod";

export const validUuid = {
  paramsSchema: z
    .object({
      id: z.uuid(),
    })
    .strict(),
};
