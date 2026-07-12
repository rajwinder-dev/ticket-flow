import { z } from "zod";

// If you already have enums from Prisma, mirror them here
export const tokenTypeEnum = z.enum([
  "INVITE_USER",
  "RESET_PASSWORD",
  "CHANGE_EMAIL",
  "CHANGE_USERNAME",
  "VERIFY_EMAIL",
]);

export const tokenSchemaResponse = z.object({
  id: z.string(),
  email: z.email(),
  type: tokenTypeEnum,
  createdAt: z.coerce.date(),
  organizationId: z.string().nullable(),
  role: z.string().nullable().optional(),
  userId: z.string().nullable(),
});
export type tokenSchemaResponse = z.infer<typeof tokenSchemaResponse>;
