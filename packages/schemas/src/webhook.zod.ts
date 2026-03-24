import { z } from "zod";

export const IncomingEmailSchema = {
  bodySchema: z.object({
    from: z.email(),
    fromName: z.string().optional(), // May be null
    to: z.email(), // Used to identify the Organization
    subject: z.string().default("(No Subject)"),
    textBody: z.string(),
    messageId: z.string(), // For threading
    inReplyTo: z.string().optional(), // For threading
  }),
};

export type IncomingEmailSchema = z.infer<typeof IncomingEmailSchema.bodySchema>;
