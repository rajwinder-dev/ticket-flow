import { z } from "zod";
export declare const createQueueGroupInput: {
    bodySchema: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        isDefault: z.ZodBoolean;
    }, z.core.$strict>;
};
export declare const createQueueInput: {
    bodySchema: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
};
export declare const updateQueueInput: {
    bodySchema: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
};
export declare const addAgentsToQueueInput: {
    bodySchema: z.ZodObject<{
        agentIds: z.ZodArray<z.ZodString>;
    }, z.core.$strict>;
};
export declare const removeAgentsFromQueueInput: {
    bodySchema: z.ZodObject<{
        agentIds: z.ZodArray<z.ZodString>;
    }, z.core.$strict>;
};
export declare const queueGroupSchemaResponse: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    queueCount: z.ZodNumber;
    queueAgentsCount: z.ZodNumber;
    default: z.ZodBoolean;
}, z.core.$strip>;
export declare const queueSchemaResponse: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    order: z.ZodNumber;
    agentsCount: z.ZodNumber;
    ticketsCount: z.ZodNumber;
    createdAt: z.ZodDate;
}, z.core.$strip>;
declare const queueDetailsSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    organizationId: z.ZodString;
    queueGroupId: z.ZodNullable<z.ZodString>;
    order: z.ZodNumber;
    active: z.ZodBoolean;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    queueGroup: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const queueSummarySchema: z.ZodObject<{
    totalTickets: z.ZodNumber;
    openTickets: z.ZodNumber;
    highPriorityTickets: z.ZodNumber;
    activeAgents: z.ZodNumber;
}, z.core.$strip>;
export type QueueDetailsSchema = z.infer<typeof queueDetailsSchema>;
export type QueueGroupSchemaResponse = z.infer<typeof queueGroupSchemaResponse>;
export type QueueSchemaResponse = z.infer<typeof queueSchemaResponse>;
export type CreateQueueGroupInput = z.infer<typeof createQueueGroupInput.bodySchema>;
export type CreateQueueInput = z.infer<typeof createQueueInput.bodySchema>;
export type UpdateQueueInput = z.infer<typeof updateQueueInput.bodySchema>;
export type AddAgentsToQueueInput = z.infer<typeof addAgentsToQueueInput.bodySchema>;
export type RemoveAgentsFromQueueInput = z.infer<typeof removeAgentsFromQueueInput.bodySchema>;
export type QueueSummarySchema = z.infer<typeof queueSummarySchema>;
export {};
//# sourceMappingURL=queue.zod.d.ts.map