import {
  NotificationChannel,
  NotificationType,
  Prisma,
  prisma,
} from '@org/database';
import { io } from '../../main';

export class NotificationServiceClass {
  async sendNotification({
    recipientId,
    organizationId,
    data,
  }: {
    recipientId: string;
    organizationId: string;
    data: {
      title: string;
      message: string;
      type: NotificationType;
      actorId?: string;
      ticketId?: string;
      channel?: NotificationChannel;
      metadata?: Prisma.InputJsonValue;
      expiresAt?: Date;
    };
  }) {
    const notification = await prisma.notification.create({
      data: {
        recipientId,
        organizationId,
        ...data,
      },
    });
    io.to(`user.${notification.recipientId}`).emit('queryKey', 'notification');
    return notification;
  }
  async getNotifications({
    userId,
    organizationId,
    limit,
    offset,
  }: {
    userId: string;
    organizationId: string;
    limit: number;
    offset: number;
  }) {
    const where = {
      recipientId: userId,
      deleted: false,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    };

    const [data, total, unread] = await Promise.all([
      prisma.notification.findMany({
        where: {
          ...where,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          actor: { select: { id: true, name: true, image: true } },
          ticket: { select: { id: true, code: true, subject: true } },
          organization: { select: { id: true, name: true } },
        },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          recipientId: userId,
          organizationId,
          deleted: false,
          isRead: false,
        },
      }),
    ]);

    return { data, total, unread, limit, offset };
  }

  async markNotificationAsRead({
    notificationId,
    userId,
  }: {
    notificationId: string;
    userId: string;
  }) {
    const data = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        recipientId: userId,
        deleted: false,
      },
      data: {
        readAt: new Date(),
        isRead: true,
      },
    });
    return { updated: data.count > 0 };
  }

  async markAllNotificationsAsRead({ userId }: { userId: string }) {
    const data = await prisma.notification.updateMany({
      where: {
        recipientId: userId,
        deleted: false,
        isRead: false,
      },
      data: {
        readAt: new Date(),
        isRead: true,
      },
    });
    return { updated: data.count };
  }

  async deleteNotification({
    notificationId,
    userId,
  }: {
    notificationId: string;
    userId: string;
  }) {
    const data = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        recipientId: userId,
        deleted: false,
      },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
    return { deleted: data.count > 0 };
  }

  async deleteAllNotifications({ userId }: { userId: string }) {
    const data = await prisma.notification.updateMany({
      where: {
        recipientId: userId,
        deleted: false,
      },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
    return { deleted: data.count };
  }
}

export const notificationService = new NotificationServiceClass();
