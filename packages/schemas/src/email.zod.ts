import { z } from "zod";
import { validEmail } from "./helper/zodHelper.js";

// --- Sub-Schemas for Credentials ---
export const smtpSchema = z.object({
  host: z.string().trim().min(1, "Host is required"),
  port: z.number().int().positive().max(65535),
  user: z.string().trim().min(1, "Username is required"),
  pass: z.string().min(1, "Password is required"),
});
export const createSmtpInput = {
  bodySchema: z.object({
    fromEmail: validEmail,
    credentials: smtpSchema  }),
};

const resendSchema = z.object({
  providerType: z.literal("RESEND"),
  fromEmail: validEmail,
  webhookSecret: z.string().trim().optional(),
  credentials: z.object({
    apiKey: z.string().trim().min(1, "API Key is required"),
  }),
});

const mailtrapSchema = z.object({
  providerType: z.literal("MAILTRAP"),
  fromEmail: validEmail,
  webhookSecret: z.string().trim().optional(),
  credentials: z.object({
    user: z.string().trim().min(1, "Username is required"),
    pass: z.string().min(1, "Password is required"),
  }),
});

// --- Main Inputs ---

export const createEmailProviderInput = {
  bodySchema: z.discriminatedUnion("providerType", [resendSchema]),
};

export const updateEmailProviderInput = {
  bodySchema: z.discriminatedUnion("providerType", [resendSchema]),
};

export const emailProviderSchema = z.object({
  id: z.uuid(),
  providerType: z.enum(["RESEND", "SMTP"]),
  fromEmail: z.email(),
  domain: z.url(),
  priority: z.number(),
});

export const emailJobSchema = z.object({
  jobType: z.literal("email"),
  to: z.email(),
  subject: z.string().min(1),
  data: z.unknown(),
  template: z.enum(["invite", "forgetPassword", "resetPassword", "welcome"]),
  organizationId: z.string().optional(),
  isSystemEmail: z.boolean(),
});

export type EmailQueueInput = z.infer<typeof emailJobSchema>;
export type EmailProviderSchema = z.infer<typeof emailProviderSchema>;
// --- Inferred Types ---
export type CreateEmailProviderInput = z.infer<typeof createEmailProviderInput.bodySchema>;
export type UpdateEmailProviderInput = z.infer<typeof updateEmailProviderInput.bodySchema>;

// Individual types for helper functions
export type CreateSmtpInput = z.infer<typeof createSmtpInput.bodySchema>;
export type ResendSchema = z.infer<typeof resendSchema>;
export type MailtrapSchema = z.infer<typeof mailtrapSchema>;
export type SmtpSchema  = z.infer<typeof smtpSchema>;
