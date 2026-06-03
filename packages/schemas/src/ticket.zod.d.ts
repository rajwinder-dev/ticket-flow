import { ticketActions, ticketCategory, ticketPriority, ticketStatus } from "@repo/constants";
import { z } from "zod";
export declare const createTicketInput: {
    bodySchema: z.ZodObject<{
        subject: z.ZodString;
        description: z.ZodString;
        email: z.ZodEmail;
        priority: z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
            URGENT: "URGENT";
        }>;
        category: z.ZodString;
        assignment: z.ZodOptional<z.ZodObject<{
            groupId: z.ZodOptional<z.ZodUUID>;
            queueId: z.ZodOptional<z.ZodUUID>;
            agentId: z.ZodOptional<z.ZodUUID>;
        }, z.core.$strip>>;
    }, z.core.$strict>;
};
export declare const updateTicketInput: {
    bodySchema: z.ZodObject<{
        subject: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        priority: z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
            URGENT: "URGENT";
        }>;
        category: z.ZodString;
    }, z.core.$strict>;
};
export declare const updateTicketStatusInput: {
    paramsSchema: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strict>;
    bodySchema: z.ZodObject<{
        status: z.ZodEnum<{
            OPEN: "OPEN";
            IN_PROGRESS: "IN_PROGRESS";
            ON_HOLD: "ON_HOLD";
            RESOLVED: "RESOLVED";
            REOPENED: "REOPENED";
            CLOSED: "CLOSED";
            ESCALATED: "ESCALATED";
        }>;
        version: z.ZodNumber;
    }, z.core.$strict>;
};
export declare const updateTicketPriorityInput: {
    paramsSchema: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strict>;
    bodySchema: z.ZodObject<{
        priority: z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
            URGENT: "URGENT";
        }>;
        version: z.ZodNumber;
    }, z.core.$strict>;
};
export declare const createTicketCommentInput: {
    paramsSchema: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strict>;
    bodySchema: z.ZodObject<{
        comment: z.ZodString;
        isInternal: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strict>;
};
export declare const assignTicketInput: {
    paramsSchema: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strict>;
    bodySchema: z.ZodObject<{
        assignId: z.ZodUUID;
        targetType: z.ZodEnum<{
            AGENT: "AGENT";
            QUEUE: "QUEUE";
        }>;
    }, z.core.$strict>;
};
export declare const escalateTicketInput: {
    paramsSchema: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strict>;
    bodySchema: z.ZodObject<{
        reason: z.ZodEnum<{
            other: "other";
            "technical-complexity": "technical-complexity";
            "customer-dissatisfaction": "customer-dissatisfaction";
            "sla-breach": "sla-breach";
            "security-concern": "security-concern";
            "billing-dispute": "billing-dispute";
            "requires-approval": "requires-approval";
            "repeat-issue": "repeat-issue";
        }>;
        priority: z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
            URGENT: "URGENT";
        }>;
        comment: z.ZodString;
        groupId: z.ZodOptional<z.ZodUUID>;
    }, z.core.$strip>;
};
export declare const ticketSchemaResponse: z.ZodObject<{
    id: z.ZodUUID;
    code: z.ZodString;
    subject: z.ZodString;
    category: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
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
    active: z.ZodBoolean;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    organizationId: z.ZodUUID;
    queueId: z.ZodUUID;
    customerId: z.ZodUUID;
    assignedTo: z.ZodUUID;
    assignedBy: z.ZodNullable<z.ZodUUID>;
    assignedToUser: z.ZodObject<{
        id: z.ZodUUID;
        username: z.ZodString;
    }, z.core.$strip>;
    queue: z.ZodNullable<z.ZodObject<{
        name: z.ZodString;
    }, z.core.$strip>>;
    version: z.ZodNumber;
}, z.core.$strip>;
export declare const ticketEscalationOptions: z.ZodObject<{
    currentQueue: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>>;
    nextQueue: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const ticketSummary: z.ZodObject<{
    total: z.ZodNumber;
    open: z.ZodNumber;
    inProgress: z.ZodNumber;
    resolved: z.ZodNumber;
}, z.core.$strip>;
export declare const ticketDetailsSchema: z.ZodObject<{
    id: z.ZodUUID;
    code: z.ZodString;
    subject: z.ZodString;
    status: z.ZodString;
    description: z.ZodString;
    priority: z.ZodString;
    category: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    assignedToUser: z.ZodNullable<z.ZodObject<{
        email: z.ZodString;
        username: z.ZodString;
    }, z.core.$strip>>;
    customer: z.ZodNullable<z.ZodObject<{
        email: z.ZodEmail;
        name: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    queue: z.ZodNullable<z.ZodObject<{
        name: z.ZodString;
        order: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const commentSchemaResponse: z.ZodObject<{
    id: z.ZodUUID;
    comment: z.ZodString;
    createdAt: z.ZodDate;
    author: z.ZodObject<{
        username: z.ZodString;
        email: z.ZodEmail;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const ticketTranslationSchema: z.ZodObject<{
    createdAt: z.ZodDate;
    action: z.ZodEnum<{
        ESCALATED: "ESCALATED";
        ASSIGNED: "ASSIGNED";
        STATUS_CHANGED: "STATUS_CHANGED";
        PRIORITY_CHANGED: "PRIORITY_CHANGED";
        NOTE_ADDED: "NOTE_ADDED";
    }>;
    fromPriority: z.ZodNullable<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        URGENT: "URGENT";
    }>>;
    toPriority: z.ZodNullable<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        URGENT: "URGENT";
    }>>;
    fromStatus: z.ZodNullable<z.ZodEnum<{
        OPEN: "OPEN";
        IN_PROGRESS: "IN_PROGRESS";
        ON_HOLD: "ON_HOLD";
        RESOLVED: "RESOLVED";
        REOPENED: "REOPENED";
        CLOSED: "CLOSED";
        ESCALATED: "ESCALATED";
    }>>;
    toStatus: z.ZodNullable<z.ZodEnum<{
        OPEN: "OPEN";
        IN_PROGRESS: "IN_PROGRESS";
        ON_HOLD: "ON_HOLD";
        RESOLVED: "RESOLVED";
        REOPENED: "REOPENED";
        CLOSED: "CLOSED";
        ESCALATED: "ESCALATED";
    }>>;
    escalationReason: z.ZodNullable<z.ZodString>;
    note: z.ZodNullable<z.ZodString>;
    fromQueue: z.ZodNullable<z.ZodObject<{
        name: z.ZodString;
    }, z.core.$strip>>;
    toQueue: z.ZodNullable<z.ZodObject<{
        name: z.ZodString;
    }, z.core.$strip>>;
    fromAgent: z.ZodNullable<z.ZodObject<{
        username: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    toAgent: z.ZodNullable<z.ZodObject<{
        username: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    fromGroup: z.ZodNullable<z.ZodObject<{
        name: z.ZodString;
    }, z.core.$strip>>;
    toGroup: z.ZodNullable<z.ZodObject<{
        name: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type TicketPriority = (typeof ticketPriority)[number];
export type TicketStatus = (typeof ticketStatus)[number];
export type TicketCategory = (typeof ticketCategory)[number];
export type ticketAction = (typeof ticketActions)[number];
export type TicketSchemaResponse = z.infer<typeof ticketSchemaResponse>;
export type CreateTicketInput = z.infer<typeof createTicketInput.bodySchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketInput.bodySchema>;
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusInput.bodySchema>;
export type UpdateTicketPriorityInput = z.infer<typeof updateTicketPriorityInput.bodySchema>;
export type CreateTicketCommentInput = z.infer<typeof createTicketCommentInput.bodySchema>;
export type AssignTicketInput = z.infer<typeof assignTicketInput.bodySchema>;
export type EscalateTicketInput = z.infer<typeof escalateTicketInput.bodySchema>;
export type TicketEscalationOptions = z.infer<typeof ticketEscalationOptions>;
export type TicketSummary = z.infer<typeof ticketSummary>;
export type TicketDetailsSchema = z.infer<typeof ticketDetailsSchema>;
export type CommentSchemaResponse = z.infer<typeof commentSchemaResponse>;
export type TicketTransitionSchema = z.infer<typeof ticketTranslationSchema>;
//# sourceMappingURL=ticket.zod.d.ts.map