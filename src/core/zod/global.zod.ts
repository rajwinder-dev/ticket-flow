import { z } from "zod";
import { validId } from "../helper/zodHelper";

export const params = {
  paramsSchema: z
    .object({
      id: validId,
    })
    .strict(),
};
