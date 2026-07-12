import { z } from "zod";

export const activityLogSchema = z.object({
  id: z.string(),
  createdAt: z.string(), // optionally: .datetime()
  actorId: z.string(),
  actorType: z.string(),
  event: z.string(),
  severity: z.enum(["INFO", "WARN", "ERROR", "DEBUG"]),
  entityType: z.string(),
  entityId: z.string(),
  changes: z.record(z.string(), z.unknown()).nullable(),
  message: z.string(),
  metadata: z.record(z.string(), z.string()),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  organizationId: z.string(),
});
export const activitySummaryResponse = z.object({
  warn: z.number(),
  info: z.number(),
  error: z.number(),
  total: z.number()
})
export type ActivityLogSchema = z.infer<typeof activityLogSchema>;
export type ActivitySummaryResponse = z.infer<typeof activitySummaryResponse>;


