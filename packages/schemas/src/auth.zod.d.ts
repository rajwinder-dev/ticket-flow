import { z } from "zod";
export declare const signupInput: {
    bodySchema: z.ZodObject<{
        username: z.ZodString;
        email: z.ZodEmail;
        password: z.ZodString;
        confirmPassword: z.ZodString;
    }, z.core.$strict>;
};
export declare const loginInput: {
    bodySchema: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.core.$strict>;
};
export declare const changePasswordInput: {
    bodySchema: z.ZodObject<{
        currentPassword: z.ZodString;
        password: z.ZodString;
        confirmPassword: z.ZodString;
    }, z.core.$strict>;
};
export declare const updatePasswordInput: {
    bodySchema: z.ZodObject<{
        employeeId: z.ZodNumber;
        password: z.ZodString;
        confirmPassword: z.ZodString;
    }, z.core.$strict>;
};
export declare const resetPasswordInput: {
    bodySchema: z.ZodObject<{
        password: z.ZodString;
        confirmPassword: z.ZodString;
    }, z.core.$strict>;
};
export declare const authToken: z.ZodObject<{
    accessToken: z.ZodString;
}, z.core.$strip>;
export declare const authDetails: z.ZodObject<{
    id: z.ZodUUID;
    email: z.ZodEmail;
}, z.core.$strip>;
export declare const authPermissions: z.ZodObject<{
    permissions: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type AuthToken = z.infer<typeof authToken>;
export type AuthDetails = z.infer<typeof authDetails>;
export type AuthPermissions = z.infer<typeof authPermissions>;
export type SignupInput = z.infer<typeof signupInput.bodySchema>;
export type LoginInput = z.infer<typeof loginInput.bodySchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordInput.bodySchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordInput.bodySchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordInput.bodySchema>;
//# sourceMappingURL=auth.zod.d.ts.map