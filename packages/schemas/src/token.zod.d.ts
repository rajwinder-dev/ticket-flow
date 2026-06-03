import { z } from "zod";
export declare const tokenTypeEnum: z.ZodEnum<{
    INVITE_USER: "INVITE_USER";
    RESET_PASSWORD: "RESET_PASSWORD";
    CHANGE_EMAIL: "CHANGE_EMAIL";
    CHANGE_USERNAME: "CHANGE_USERNAME";
    VERIFY_EMAIL: "VERIFY_EMAIL";
}>;
export declare const tokenSchemaResponse: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodEmail;
    type: z.ZodEnum<{
        INVITE_USER: "INVITE_USER";
        RESET_PASSWORD: "RESET_PASSWORD";
        CHANGE_EMAIL: "CHANGE_EMAIL";
        CHANGE_USERNAME: "CHANGE_USERNAME";
        VERIFY_EMAIL: "VERIFY_EMAIL";
    }>;
    createdAt: z.ZodCoercedDate<unknown>;
    organizationId: z.ZodNullable<z.ZodString>;
    role: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    userId: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type tokenSchemaResponse = z.infer<typeof tokenSchemaResponse>;
//# sourceMappingURL=token.zod.d.ts.map