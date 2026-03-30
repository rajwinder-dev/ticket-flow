import { z } from "zod";
import { validEmail } from "./helper/zodHelper";

export const incomingEmailSchema = {
  bodySchema: z
    .object({
      // Normalizing to lowercase is vital for lookup in your DB
      from: validEmail,
      fromName: z.string().trim().optional(),
      to: validEmail,
      subject: z
        .string()
        .trim()
        .default("(No Subject)")
        .transform((val) => (val === "" ? "(No Subject)" : val)),
      textBody: z.string().min(1, "Email body cannot be empty"),
      messageId: z.string().min(1, "Message-ID is required for threading"),
      inReplyTo: z.string().trim().optional(),
    })
    .strict(),
};

// --- Inferred Type ---
export type IncomingEmail = z.infer<typeof incomingEmailSchema.bodySchema>;
