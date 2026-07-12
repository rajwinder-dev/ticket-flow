import { z } from "zod";

export const resendEmailAttachmentSchema = z.object({
  id: z.string(),
  filename: z.string(),
  content_type: z.string(),
  content_disposition: z.enum(["inline", "attachment"]),
  content_id: z.string().optional(),
});

export const resendEmailDataSchema = z.object({
  email_id: z.string(),
  created_at: z.string(),
  from: z.string(),
  to: z.array(z.string()),
  cc: z.array(z.string()),
  bcc: z.array(z.string()),
  message_id: z.string(),
  subject: z.string(),
  attachments: z.array(resendEmailAttachmentSchema),
});

export const resentEmailWebhookSchema = z.object({
  type: z.string(),
  created_at: z.string(),
  data: resendEmailDataSchema,
});
// --- Inferred Type ---
export type ResentEmailWebhookSchema = z.infer<typeof resentEmailWebhookSchema>;
