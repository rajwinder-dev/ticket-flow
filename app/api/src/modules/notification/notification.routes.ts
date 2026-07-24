import { Router } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { NotificationController } from './notification.controller';

const notificationRouter: Router = Router();
notificationRouter.post('/test/:id', NotificationController.sendtestnotification);
notificationRouter.use(authMiddleware.protectedRoute)

notificationRouter.get('/', NotificationController.getNotifications);
notificationRouter.patch(
  '/mark-as-read/:notificationId',
  NotificationController.markNotificationAsRead,
);
notificationRouter.patch(
  '/mark-all-as-read',
  NotificationController.markAllNotificationsAsRead,
);
notificationRouter.delete(
  '/delete/:notificationId',
  NotificationController.deleteNotification,
);
notificationRouter.delete(
  '/delete-all',
  NotificationController.deleteAllNotifications,
);
export default notificationRouter;
