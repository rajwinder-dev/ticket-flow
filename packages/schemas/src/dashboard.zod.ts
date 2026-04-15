import { ticketPriority, ticketStatus } from "@repo/constants";
import { z } from "zod";

export const recentTicketSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  subject: z.string(),
  status: z.enum(ticketStatus),
  priority: z.enum(ticketPriority),
  assignedToUser: z
    .object({
      username: z.string().nullable(),
    })
    .optional(),
});
export const statusCountsSchema = z.object({
  OPEN: z.number().int().min(0),
  IN_PROGRESS: z.number().int().min(0),
  RESOLVED: z.number().int().min(0),
  CLOSED: z.number().int().min(0),
  ON_HOLD: z.number().int().min(0),
  REOPENED: z.number().int().min(0),
  TOTAL: z.number().int().min(0),
});

// Extract the TypeScript type from the schema
export type StatusCountsSchema = z.infer<typeof statusCountsSchema>;
export type RecentTicketSchema = z.infer<typeof recentTicketSchema>;
