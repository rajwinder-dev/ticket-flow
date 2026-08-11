import {
  NotificationChannel,
  NotificationType,
  Prisma,
  prisma,
} from '@org/database';
import { logger } from '../../core/utils/logger';
import { SocketService } from '../socket/socket.service';
import { appError } from '../../core/utils/appError';
/**
 * invalidate belong to frontend cache of react query
 */
export class NotificationServiceClass {
  async sendNotification({
    userId,
    recipientId,
    data,
  }: {
    recipientId: string;
    userId: string | null;
    data: {
      organizationId?: string;
      title: string;
      message: string;
      type: NotificationType;
      actorId?: string;
      ticketId?: string;
      channel: NotificationChannel;
      metadata?: Prisma.InputJsonValue;
      expiresAt?: Date;
    };
  }) {
    if (userId !== null && userId === recipientId)
      return logger.info('cannot send notification to yourself');

    const notification = await prisma.notification.create({
      data: {
        recipientId,
        ...data,
      },
    });

    SocketService.invlidUserQuery({ recipientId, keys: ['notification'] });
    return notification;
  }
  async getNotifications({
    userId,
    limit,
    offset,
  }: {
    userId: string;
    limit: number;
    offset: number;
  }) {
    const where = {
      recipientId: userId,
      deleted: false,
      // OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
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
          organization: { select: { id: true, name: true } },
        },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          recipientId: userId,
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
    if (data.count === 0)
      throw new appError('Notification not found', 404, 'NOT_FOUND');
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
    if (data.count === 0)
      throw new appError('Notification not found', 404, 'NOT_FOUND');
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

export const NotificationService = new NotificationServiceClass();
