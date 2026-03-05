import z from "zod";
import {
  validDescription,
  validString,
} from "../../core/helper/zodHelper";

export const roleSchema = {
  bodySchema: z.object({
    name: validString,
    description: validDescription,
  }).strict(),
};
export const updateRoleSchema = {
  bodySchema: z.object({
    description: validDescription,
  }).strict(),
};
