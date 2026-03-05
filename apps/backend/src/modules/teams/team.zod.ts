import { z } from "zod";
import { validId } from "../../core/helper/zodHelper";

export const teamMemberSchema = {
  bodySchema: z
    .object({
      employeeIds: z.array(z.number()).nonempty(),
    })
    .strict(),
  paramsSchema: z
    .object({
      id: validId,
    })
    .strict(),
};
export const updateRoleSchema = {
  bodySchema: z
    .object({
      role: z.enum(["manger", "employee"]),
    })
    .strict(),
  paramsSchema: z
    .object({
      id: validId,
    })
    .strict(),
};
