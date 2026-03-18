import z from "zod";
import { validDescription, validString } from "./helper/zodHelper";

export const creteRoleInput = {
  bodySchema: z
    .object({
      name: validString,
      description: validDescription.optional(),
      permissions: z.record(z.string(), z.array(z.string())),
    })
    .strict(),
};
export const updateRoleInput = {
  bodySchema: z
    .object({
      description: validDescription.optional(),
      permissions: z.record(z.string(), z.array(z.string())),
    })
    .strict(),
};
export type CreateRoleInput = z.infer<typeof creteRoleInput.bodySchema>;
export type updateRoleInput = z.infer<typeof updateRoleInput.bodySchema>;
