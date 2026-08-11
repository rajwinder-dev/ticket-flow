import { APIFeatures } from '../../core/utils/apiFeatures.js';
import { catchAsync } from '../../core/utils/catchAsync.js';
import response from '../../core/utils/response.js';
import { NotificationService } from './notification.service.js';

class NotificationControllerClass {
  sendtestnotification = catchAsync(async (req, res) => {
    const data = await NotificationService.sendNotification({
      recipientId: req.params.id as string,
      userId: req.user.id,
      data: {
        channel: 'IN_APP',
        title: 'test',
        message: 'test',
        type: 'SYSTEM',
        metadata: { test: 'test' },
        expiresAt: new Date(),
      },
    });
    response(res, data);
  });
  getNotifications = catchAsync(async (req, res) => {
    const { limit, offset } = new APIFeatures(req.query).pagination();
    const result = await NotificationService.getNotifications({
      userId: req.user.id,
      limit,
      offset,
    });

    response(res, result.data, 200, {
      otherFields: {
        total: result.total,
        unread: result.unread,
        limit,
        offset,
      },
    });
  });

  markNotificationAsRead = catchAsync(async (req, res) => {
    const { notificationId } = req.params as { notificationId: string };
    const data = await NotificationService.markNotificationAsRead({
      notificationId,
      userId: req.user.id,
    });
    response(res, data);
  });

  markAllNotificationsAsRead = catchAsync(async (req, res) => {
    const data = await NotificationService.markAllNotificationsAsRead({
      userId: req.user.id,
    });
    response(res, data);
  });

  deleteNotification = catchAsync(async (req, res) => {
    const { notificationId } = req.params as { notificationId: string };
    await NotificationService.deleteNotification({
      notificationId,
      userId: req.user.id,
    });
    response(res, null, 204);
  });

  deleteAllNotifications = catchAsync(async (req, res) => {
    await NotificationService.deleteAllNotifications({
      userId: req.user.id,
    });
    response(res, null, 204);
  });
}
export const NotificationController = new NotificationControllerClass();
