import { z } from "zod";
export declare const createSmtpInput: {
    bodySchema: z.ZodObject<{
        fromEmail: z.ZodEmail;
        credentials: z.ZodObject<{
            host: z.ZodString;
            port: z.ZodNumber;
            user: z.ZodString;
            pass: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
declare const resendSchema: z.ZodObject<{
    providerType: z.ZodLiteral<"RESEND">;
    fromEmail: z.ZodEmail;
    webhookSecret: z.ZodOptional<z.ZodString>;
    credentials: z.ZodObject<{
        apiKey: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const mailtrapSchema: z.ZodObject<{
    providerType: z.ZodLiteral<"MAILTRAP">;
    fromEmail: z.ZodEmail;
    webhookSecret: z.ZodOptional<z.ZodString>;
    credentials: z.ZodObject<{
        user: z.ZodString;
        pass: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const createEmailProviderInput: {
    bodySchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
        providerType: z.ZodLiteral<"RESEND">;
        fromEmail: z.ZodEmail;
        webhookSecret: z.ZodOptional<z.ZodString>;
        credentials: z.ZodObject<{
            apiKey: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>], "providerType">;
};
export declare const updateEmailProviderInput: {
    bodySchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
        providerType: z.ZodLiteral<"RESEND">;
        fromEmail: z.ZodEmail;
        webhookSecret: z.ZodOptional<z.ZodString>;
        credentials: z.ZodObject<{
            apiKey: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>], "providerType">;
};
export declare const emailProviderSchema: z.ZodObject<{
    id: z.ZodUUID;
    providerType: z.ZodEnum<{
        SMTP: "SMTP";
        RESEND: "RESEND";
    }>;
    fromEmail: z.ZodEmail;
    domain: z.ZodURL;
    priority: z.ZodNumber;
}, z.core.$strip>;
export declare const emailJobSchema: z.ZodObject<{
    jobType: z.ZodLiteral<"email">;
    to: z.ZodEmail;
    subject: z.ZodString;
    data: z.ZodUnknown;
    template: z.ZodEnum<{
        invite: "invite";
        forgetPassword: "forgetPassword";
        resetPassword: "resetPassword";
        welcome: "welcome";
    }>;
    organizationId: z.ZodOptional<z.ZodString>;
    isSystemEmail: z.ZodBoolean;
}, z.core.$strip>;
export type EmailQueueInput = z.infer<typeof emailJobSchema>;
export type EmailProviderSchema = z.infer<typeof emailProviderSchema>;
export type CreateEmailProviderInput = z.infer<typeof createEmailProviderInput.bodySchema>;
export type UpdateEmailProviderInput = z.infer<typeof updateEmailProviderInput.bodySchema>;
export type CreateSmtpInput = z.infer<typeof createSmtpInput.bodySchema>;
export type ResendSchema = z.infer<typeof resendSchema>;
export type MailtrapSchema = z.infer<typeof mailtrapSchema>;
export {};
//# sourceMappingURL=email.zod.d.ts.map