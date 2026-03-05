import { z } from "zod";
import { validPassword, validString } from "../../core/helper/zodHelper";

export const loginSchema = {
  bodySchema: z
    .object({
      username: validString,
      password: validPassword,
    })
    .strict(),
};
export const changePasswordSchema = {
  bodySchema: z
    .object({
      currentPassword: validPassword,
      password: validPassword,
      confirmPassword: validPassword,
    })
    .strict(),
};

export const updatePasswordSchema = {
  bodySchema: z
    .object({
      employeeId: z.number(),
      password: z.string().min(1),
      confirmPassword: z.string(),
    })
    .strict(),
};
