import z from "zod";

const smtpSchema = z.object({
  providerType: z.literal("SMTP"),
  credentials: z.object({
    host: z.string(),
    port: z.number(),
    user: z.string(),
    pass: z.string(),
  }),
});

const sendgridSchema = z.object({
  providerType: z.literal("SEND_GRID"),
  credentials: z.object({
    apiKey: z.string(),
  }),
});

const mailtrapSchema = z.object({
  providerType: z.literal("MAILTRAP"),
  credentials: z.object({
    user: z.string(),
    pass: z.string(),
  }),
});
export const createEmailProviderInput = {
  bodySchema: z.discriminatedUnion("providerType", [smtpSchema, sendgridSchema, mailtrapSchema]),
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
export type UpdateEmailProviderInput = z.infer<typeof updateEmailProviderInput.bodySchema>;
