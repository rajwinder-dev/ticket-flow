import { z } from "zod";
import { validPassword, validString } from "./helper/zodHelper";

export const loginInput = {
  bodySchema: z
    .object({
      username: validString,
      password: validPassword,
    })
    .strict(),
};
export const changePasswordInput = {
  bodySchema: z
    .object({
      currentPassword: validPassword,
      password: validPassword,
      confirmPassword: validPassword,
    })
    .strict(),
};
export const updatePasswordInput = {
  bodySchema: z
    .object({
      employeeId: z.number(),
      password: z.string().min(1),
      confirmPassword: z.string(),
    })
    .strict(),
};
export type ChangePasswordInput = z.infer<typeof changePasswordInput.bodySchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordInput.bodySchema>;
export type LoginInput = z.infer<typeof loginInput.bodySchema>;
