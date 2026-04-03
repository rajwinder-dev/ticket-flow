import { z } from "zod";
import { validDomain } from "./helper/zodHelper";

// --- Sub-Schemas for Credentials ---

const smtpSchema = z.object({
  credentials: z.object({
    host: z.string().trim().min(1, "Host is required"),
    port: z.number().int().positive().max(65535),
    user: z.string().trim().min(1, "Username is required"),
    pass: z.string().min(1, "Password is required"),
  }),
});

const resendSchema = z.object({
  providerType: z.literal("RESEND"),
  domain: validDomain,
  webhookSecret: z.string().trim().optional(),
  credentials: z.object({
    apiKey: z.string().trim().min(1, "API Key is required"),
  }),
});

const mailtrapSchema = z.object({
  providerType: z.literal("MAILTRAP"),
  domain: validDomain,
  webhookSecret: z.string().trim().optional(),
  credentials: z.object({
    user: z.string().trim().min(1, "Username is required"),
    pass: z.string().min(1, "Password is required"),
  }),
});

// --- Main Inputs ---

export const createEmailProviderInput = {
  bodySchema: z.discriminatedUnion("providerType", [resendSchema, mailtrapSchema]),
};

export const updateEmailProviderInput = {
  bodySchema: z
    .object({
      domain: validDomain.optional(),
      credentials: z.record(z.string(), z.any()).optional(),
      active: z.boolean().optional(),
    })
    .strict(),
};

// --- Inferred Types ---
export type CreateEmailProviderInput = z.infer<typeof createEmailProviderInput.bodySchema>;
export type UpdateEmailProviderInput = z.infer<typeof updateEmailProviderInput.bodySchema>;

// Individual types for helper functions
export type SMTPSchema = z.infer<typeof smtpSchema>;
export type ResendSchema = z.infer<typeof resendSchema>;
export type MailtrapSchema = z.infer<typeof mailtrapSchema>;
