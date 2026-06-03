import { z } from "zod";
export declare const activityLogSchema: z.ZodObject<{
    id: z.ZodString;
    createdAt: z.ZodString;
    actorId: z.ZodString;
    actorType: z.ZodString;
    event: z.ZodString;
    severity: z.ZodEnum<{
        INFO: "INFO";
        WARN: "WARN";
        ERROR: "ERROR";
        DEBUG: "DEBUG";
    }>;
    entityType: z.ZodString;
    entityId: z.ZodString;
    changes: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    message: z.ZodString;
    metadata: z.ZodRecord<z.ZodString, z.ZodString>;
    ipAddress: z.ZodNullable<z.ZodString>;
    userAgent: z.ZodNullable<z.ZodString>;
    organizationId: z.ZodString;
}, z.core.$strip>;
export declare const activitySummaryResponse: z.ZodObject<{
    warn: z.ZodNumber;
    info: z.ZodNumber;
    error: z.ZodNumber;
    total: z.ZodNumber;
}, z.core.$strip>;
export type ActivityLogSchema = z.infer<typeof activityLogSchema>;
export type ActivitySummaryResponse = z.infer<typeof activitySummaryResponse>;
//# sourceMappingURL=activity.zod.d.ts.map