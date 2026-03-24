import z from "zod";

const smtpSchema = {
  bodySchema: z.object({
    from: z.string(),
    credentials: z.object({
      host: z.string(),
      port: z.number(),
      user: z.string(),
      pass: z.string(),
    }),
  }),
};
const resendSchema = z.object({
  providerType: z.literal("RESEND"),
  from: z.string(),
  webhookSecret: z.string(),
  credentials: z.object({
    apiKey: z.string(),
  }),
});

const mailtrapSchema = z.object({
  providerType: z.literal("MAILTRAP"),
  webhookSecret: z.string(),
  from: z.string(),
  credentials: z.object({
    user: z.string(),
    pass: z.string(),
  }),
});
export const createEmailProviderInput = {
  bodySchema: z.discriminatedUnion("providerType", [mailtrapSchema, resendSchema]),
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
export type SMTPSchema = z.infer<typeof smtpSchema.bodySchema>;
export type ResendSchema = z.infer<typeof resendSchema>;
export type UpdateEmailProviderInput = z.infer<typeof updateEmailProviderInput.bodySchema>;
