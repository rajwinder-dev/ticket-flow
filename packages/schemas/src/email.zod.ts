import z from "zod";

const smtpSchema = z.object({
  providerType: z.literal("SMTP"),
  from: z.string(),
  credentials: z.object({
    host: z.string(),
    port: z.number(),
    user: z.string(),
    pass: z.string(),
  }),
});
const resendSchema = z.object({
  providerType: z.literal("RESEND"),
  from: z.string(),
  credentials: z.object({
    apiKey: z.string(),
  }),
});

const mailtrapSchema = z.object({
  providerType: z.literal("MAILTRAP"),
  from: z.string(),
  credentials: z.object({
    user: z.string(),
    pass: z.string(),
  }),
});
export const createEmailProviderInput = {
  bodySchema: z.discriminatedUnion("providerType", [smtpSchema, mailtrapSchema, resendSchema]),
};
export const updateEmailProviderInput = {
  bodySchema: z
    .object({
      credentials: z.object({}).catchall(z.any()),
      active: z.boolean(),
    })
    .strict(),
};
export type CreateEmailProviderInput = z.infer<typeof createEmailProviderInput.bodySchema>;
export type SMTPSchema = z.infer<typeof smtpSchema>;
export type ResendSchema = z.infer<typeof resendSchema>;
export type UpdateEmailProviderInput = z.infer<typeof updateEmailProviderInput.bodySchema>;
