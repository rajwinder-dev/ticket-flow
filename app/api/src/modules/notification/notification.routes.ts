import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { authMiddleware } from '../auth/auth.middleware';

const notificationRouter: Router = Router();

notificationRouter.use(authMiddleware.protectedRoute, authMiddleware.tenant)

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
