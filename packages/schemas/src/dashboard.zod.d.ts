import { z } from "zod";
export declare const recentTicketSchema: z.ZodObject<{
    id: z.ZodUUID;
    code: z.ZodString;
    subject: z.ZodString;
    status: z.ZodEnum<{
        OPEN: "OPEN";
        IN_PROGRESS: "IN_PROGRESS";
        ON_HOLD: "ON_HOLD";
        RESOLVED: "RESOLVED";
        REOPENED: "REOPENED";
        CLOSED: "CLOSED";
        ESCALATED: "ESCALATED";
    }>;
    priority: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        URGENT: "URGENT";
    }>;
    assignedToUser: z.ZodOptional<z.ZodObject<{
        username: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const statusCountsSchema: z.ZodObject<{
    OPEN: z.ZodNumber;
    IN_PROGRESS: z.ZodNumber;
    RESOLVED: z.ZodNumber;
    CLOSED: z.ZodNumber;
    ON_HOLD: z.ZodNumber;
    REOPENED: z.ZodNumber;
    TOTAL: z.ZodNumber;
}, z.core.$strip>;
export type StatusCountsSchema = z.infer<typeof statusCountsSchema>;
export type RecentTicketSchema = z.infer<typeof recentTicketSchema>;
//# sourceMappingURL=dashboard.zod.d.ts.map