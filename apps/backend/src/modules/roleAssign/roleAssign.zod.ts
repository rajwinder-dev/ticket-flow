import { z } from "zod";
import {
  validId,
  validPassword,
  validString,
} from "../../core/helper/zodHelper";

export const roleAssignSchema = {
  bodySchema: z.object({
    username: validString,
    password: validPassword,
    confirmPassword: validPassword,
    roleId: z.number(),
  }).strict(),
  paramsSchema: z.object({
    id: validId,
  }).strict(),
};
export const updateRoleAssignSchema = {
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
