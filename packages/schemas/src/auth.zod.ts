import { z } from "zod";
import { validPassword } from "./helper/zodHelper";
export const signupInput = {
  bodySchema: z
    .object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password do not match",
      path: ["confirmPassword"],
    })
    .strict(),
};
export const loginInput = {
  bodySchema: z
    .object({
      email: z.email(),
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
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password do not match",
      path: ["confirmPassword"],
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
export const resetPasswordInput = {
  bodySchema: z
    .object({
      password: z.string(),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password do not match",
      path: ["confirmPassword"],
    }),
};
export type ResetPassword = z.infer<typeof resetPasswordInput.bodySchema>
export type ChangePasswordInput = z.infer<typeof changePasswordInput.bodySchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordInput.bodySchema>;
export type LoginInput = z.infer<typeof loginInput.bodySchema>;
export type SignupInput = z.infer<typeof signupInput.bodySchema>;
