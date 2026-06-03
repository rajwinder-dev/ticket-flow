import { z } from "zod";
import { validEmail, validPassword } from "./helper/zodHelper.js";
// 2. A helper function for the common "Password Match" refinement
const passwordMatchRefine = (data) => data.password === data.confirmPassword;
const passwordMatchError = {
    message: "Passwords do not match",
    path: ["confirmPassword"],
};
export const signupInput = {
    bodySchema: z
        .object({
        username: z.string().min(2, "Username is too short"),
        email: validEmail,
        password: validPassword,
        confirmPassword: z.string(),
    })
        .strict()
        .refine(passwordMatchRefine, passwordMatchError),
};
export const loginInput = {
    bodySchema: z
        .object({
        email: validEmail,
        password: z.string(),
    })
        .strict(),
};
export const changePasswordInput = {
    bodySchema: z
        .object({
        currentPassword: z.string(),
        password: validPassword,
        confirmPassword: validPassword,
    })
        .strict()
        .refine(passwordMatchRefine, passwordMatchError),
};
export const updatePasswordInput = {
    bodySchema: z
        .object({
        employeeId: z.number(),
        password: validPassword,
        confirmPassword: z.string(),
    })
        .strict()
        .refine(passwordMatchRefine, passwordMatchError),
};
export const resetPasswordInput = {
    bodySchema: z
        .object({
        password: validPassword,
        confirmPassword: z.string(),
    })
        .strict()
        .refine(passwordMatchRefine, passwordMatchError),
};
// Response types
export const authToken = z.object({
    accessToken: z.string(),
});
export const authDetails = z.object({
    id: z.uuid(),
    email: z.email(),
});
export const authPermissions = z.object({
    permissions: z.record(z.string(), z.array(z.string())),
});
//# sourceMappingURL=auth.zod.js.map