import { z } from 'zod';
// must be sync with schema 
export const notificationType = z.enum([
  'TICKET',
  'RBAC',
  'MEMBER',
  'GROUP',
  'QUEUE',
  'ORGANIZATION',
  'CUSTOMER',
  'EMAIL',
  'USER',
  'SYSTEM',
]) ;

const notificationChannel = z.enum(['IN_APP', 'EMAIL']);

export const notificationSchema = z.object({
  id: z.uuid(),
  organizationId: z.uuid(),
  recipientId: z.uuid(),
  actorId: z.uuid().nullable(),
  ticketId: z.uuid().nullable(),
  type: notificationType,
  channel: notificationChannel,
  title: z.string(),
  message: z.string(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  readAt: z.coerce.date().nullable(),
  isRead: z.boolean(),
  deletedAt: z.coerce.date().nullable(),
  deleted: z.boolean(),
  expiresAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  actor: z
    .object({
      id: z.uuid(),
      name: z.string(),
      image: z.string().nullable(),
    })
    .nullable(),
  ticket: z
    .object({
      id: z.uuid(),
      code: z.string(),
      subject: z.string(),
    })
    .nullable(),
});

export const notificationActionResponse = z.object({
  updated: z.union([z.boolean(), z.number()]).optional(),
  deleted: z.union([z.boolean(), z.number()]).optional(),
});

export type NotificationSchema = z.infer<typeof notificationSchema>;
export type NotificationActionResponse = z.infer<
  typeof notificationActionResponse
>;
