import { APIFeatures } from '../../core/utils/apiFeatures.js';
import { catchAsync } from '../../core/utils/catchAsync.js';
import response from '../../core/utils/response.js';
import { notificationService } from './notification.service.js';

class NotificationControllerClass {
  sendtestnotification = catchAsync(async (req, res) => {
    const data = await notificationService.sendNotification({
      recipientId: req.params.id as string ,
      data: {
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
    const result = await notificationService.getNotifications({
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
    const data = await notificationService.markNotificationAsRead({
      notificationId,
      userId: req.user.id,
    });
    response(res, data);
  });

  markAllNotificationsAsRead = catchAsync(async (req, res) => {
    const data = await notificationService.markAllNotificationsAsRead({
      userId: req.user.id,
    });
    response(res, data);
  });

  deleteNotification = catchAsync(async (req, res) => {
    const { notificationId } = req.params as { notificationId: string };
    const data = await notificationService.deleteNotification({
      notificationId,
      userId: req.user.id,
    });
    response(res, data);
  });

  deleteAllNotifications = catchAsync(async (req, res) => {
    const data = await notificationService.deleteAllNotifications({
      userId: req.user.id,
    });
    response(res, data);
  });
}
export const NotificationController = new NotificationControllerClass();
