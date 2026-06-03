import { z } from "zod";
export declare const resendEmailAttachmentSchema: z.ZodObject<{
    id: z.ZodString;
    filename: z.ZodString;
    content_type: z.ZodString;
    content_disposition: z.ZodEnum<{
        attachment: "attachment";
        inline: "inline";
    }>;
    content_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const resendEmailDataSchema: z.ZodObject<{
    email_id: z.ZodString;
    created_at: z.ZodString;
    from: z.ZodString;
    to: z.ZodArray<z.ZodString>;
    cc: z.ZodArray<z.ZodString>;
    bcc: z.ZodArray<z.ZodString>;
    message_id: z.ZodString;
    subject: z.ZodString;
    attachments: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        filename: z.ZodString;
        content_type: z.ZodString;
        content_disposition: z.ZodEnum<{
            attachment: "attachment";
            inline: "inline";
        }>;
        content_id: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const resentEmailWebhookSchema: z.ZodObject<{
    type: z.ZodString;
    created_at: z.ZodString;
    data: z.ZodObject<{
        email_id: z.ZodString;
        created_at: z.ZodString;
        from: z.ZodString;
        to: z.ZodArray<z.ZodString>;
        cc: z.ZodArray<z.ZodString>;
        bcc: z.ZodArray<z.ZodString>;
        message_id: z.ZodString;
        subject: z.ZodString;
        attachments: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            filename: z.ZodString;
            content_type: z.ZodString;
            content_disposition: z.ZodEnum<{
                attachment: "attachment";
                inline: "inline";
            }>;
            content_id: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ResentEmailWebhookSchema = z.infer<typeof resentEmailWebhookSchema>;
//# sourceMappingURL=webhook.zod.d.ts.map