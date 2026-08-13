import {
  escalationReasonValues,
  ticketCategory,
  ticketActions,
  ticketPriority,
  ticketStatus,
} from '@org/constants';
import { z } from 'zod';
import {
  validBigDescription,
  validEmail,
  validString,
} from './helper/zodHelper.js';
import { validUuidParams } from './global.zod.js';
export const createTicketInput = {
  bodySchema: z
    .object({
      subject: validString,
      description: validBigDescription,
      email: validEmail,
      priority: z.enum(ticketPriority),
      category: validString,
      assignment: z
        .object({
          groupId: z.uuid().optional(),
          queueId: z.uuid().optional(),
          agentId: z.uuid().optional(),
        })
        .optional(),
    })
    .strict(),
};
export const updateTicketInput = {
  bodySchema: z
    .object({
      subject: z.string().min(2, 'Subject is required').optional(),
      description: z.string().optional(),
      priority: z.enum(ticketPriority).optional(),
      category: z.string().min(1, 'Category is required').optional(),
    })
    .strict(),
  ...validUuidParams,
};
export const updateTicketStatusInput = {
  bodySchema: z
    .object({
      status: z.enum(ticketStatus),
      version: z.number(),
    })
    .strict(),
  ...validUuidParams,
};

export const updateTicketPriorityInput = {
  bodySchema: z
    .object({
      priority: z.enum(ticketPriority),
      version: z.number(),
    })
    .strict(),
  ...validUuidParams,
};

export const createTicketCommentInput = {
  bodySchema: z
    .object({
      id: z.uuid(),
      comment: z.string().trim().min(1, 'Comment cannot be empty'),
    })
    .strict(),
  ...validUuidParams,
};
// Using trim and min(1) to prevent empty comments

export const assignTicketInput = {
  bodySchema: z
    .object({
      assignId: z.uuid('Invalid Assignment ID'),
      targetType: z.enum(['AGENT', 'QUEUE']),
    })
    .strict(),
  ...validUuidParams,
};
const AssignedToUserSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
});
export const escalateTicketInput = {
  bodySchema: z.object({
    reason: z.enum(escalationReasonValues),
    priority: z.enum(ticketPriority),
    comment: z.string().min(1, 'comment is required'),
    groupId: z.uuid().optional(),
  }),
  ...validUuidParams,
};
// Main ticket schema
export const ticketSchemaResponse = z.object({
  id: z.uuid(),
  code: z.string().trim().min(1),
  subject: z.string().min(1),
  category: z.string(),
  description: z.string().optional(),
  status: z.enum(ticketStatus),
  priority: z.enum(ticketPriority),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  organizationId: z.uuid(),
  queueId: z.uuid(),
  customerId: z.uuid(),
  assignedTo: z.uuid(),
  assignedBy: z.uuid().nullable(),
  assignedToUser: AssignedToUserSchema,
  queue: z.object({ name: z.string() }).nullable(),
  version: z.number(),
});
const QueueOptionSchema = z.object({ id: z.string(), name: z.string() });
export const ticketEscalationOptions = z.object({
  currentQueue: QueueOptionSchema.nullable(),
  nextQueue: QueueOptionSchema.nullable(),
});
export const ticketSummary = z.object({
  total: z.number(),
  open: z.number(),
  inProgress: z.number(),
  resolved: z.number(),
});

export const ticketDetailsSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  subject: z.string(),
  status: z.enum(ticketStatus),
  description: z.string(),
  priority: z.enum(ticketPriority),
  category: z.string(),
  summary: z.string(),
  keywords: z.array(z.string()),
  sentiment: z.string(),
  confidence: z.number(),
  language: z.string(),
  version: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  assignedToUser: z
    .object({
      email: z.email(),
      name: z.string(),
    })
    .nullable(),
  customer: z
    .object({
      email: z.email(),
      name: z.string().nullable(),
    })
    .nullable(),
  queue: z
    .object({
      name: z.string(),
      order: z.number(),
    })
    .nullable(),
});
export const commentSchemaResponse = z.object({
  id: z.uuid(),
  comment: z.string(), // keep as-is; includes possible "\n"
  createdAt: z.date(),
  author: z.object({
    name: z.string(),
    email: z.email(),
  }),
});
// Assuming these are your imported Prisma Enums
export const ticketTranslationSchema = z.object({
  createdAt: z.date(),
  action: z.enum(Object.values(ticketActions)),
  fromPriority: z.enum(ticketPriority).nullable(),
  toPriority: z.enum(ticketPriority).nullable(),
  fromStatus: z.enum(ticketStatus).nullable(),
  toStatus: z.enum(ticketStatus).nullable(),
  escalationReason: z.string().nullable(),
  note: z.string().nullable(),
  fromQueue: z
    .object({
      name: z.string().nullable(),
    })
    .nullable(),
  toQueue: z
    .object({
      name: z.string().nullable(),
    })
    .nullable(),
  fromAgent: z
    .object({
      name: z.string().nullable(),
    })
    .nullable(),
  toAgent: z
    .object({
      name: z.string().nullable(),
    })
    .nullable(),
  fromGroup: z
    .object({
      name: z.string().nullable(),
    })
    .nullable(),
  toGroup: z
    .object({
      name: z.string().nullable(),
    })
    .nullable(),
  changedBy: z.object({
    name: z.string().nullable(),
  }),
});

// Infer the TypeScript type from the schema
// --- Inferred Types ---
export type TicketCategory = (typeof ticketCategory)[number];
export type ticketAction = (typeof ticketActions)[number];
export type TicketSchemaResponse = z.infer<typeof ticketSchemaResponse>;
export type CreateTicketInput = z.infer<typeof createTicketInput.bodySchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketInput.bodySchema>;
export type UpdateTicketStatusInput = z.infer<
  typeof updateTicketStatusInput.bodySchema
>;
export type UpdateTicketPriorityInput = z.infer<
  typeof updateTicketPriorityInput.bodySchema
>;
export type CreateTicketCommentInput = z.infer<
  typeof createTicketCommentInput.bodySchema
>;
export type AssignTicketInput = z.infer<typeof assignTicketInput.bodySchema>;
export type EscalateTicketInput = z.infer<
  typeof escalateTicketInput.bodySchema
>;
export type TicketEscalationOptions = z.infer<typeof ticketEscalationOptions>;
export type TicketSummary = z.infer<typeof ticketSummary>;
export type TicketDetailsSchema = z.infer<typeof ticketDetailsSchema>;
export type CommentSchemaResponse = z.infer<typeof commentSchemaResponse>;
export type TicketTransitionSchema = z.infer<typeof ticketTranslationSchema>;
