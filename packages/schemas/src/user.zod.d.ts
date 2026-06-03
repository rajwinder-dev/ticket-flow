import { z } from "zod";
export declare const onboardUserInput: {
    bodySchema: z.ZodObject<{
        user: z.ZodObject<{
            location: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        organization: z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            teamSize: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strict>;
};
export declare const updateMyDetailsInput: {
    bodySchema: z.ZodObject<{
        phoneNo: z.ZodPreprocess<z.ZodOptional<z.ZodString>>;
        avatar: z.ZodPreprocess<z.ZodOptional<z.ZodURL>>;
        location: z.ZodPreprocess<z.ZodOptional<z.ZodString>>;
    }, z.core.$strict>;
};
export declare const userSchemaResponse: z.ZodObject<{
    location: z.ZodNullable<z.ZodString>;
    phoneNo: z.ZodNullable<z.ZodString>;
    avatar: z.ZodNullable<z.ZodString>;
    id: z.ZodString;
    code: z.ZodString;
    active: z.ZodBoolean;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    email: z.ZodEmail;
    username: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type UserSchema = z.infer<typeof userSchemaResponse>;
export type UpdateMyDetailsInput = z.infer<typeof updateMyDetailsInput.bodySchema>;
export type OnBoardUserInput = z.infer<typeof onboardUserInput.bodySchema>;
//# sourceMappingURL=user.zod.d.ts.map