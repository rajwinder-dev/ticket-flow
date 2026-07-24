import type { FilterOptions } from '@org/web-utils';
import type { NotificationActionResponse, NotificationSchema } from '@org/zod';
import { api } from '../../api.js';

export const notificationApi = {
  getAll: async (filterOptions?: FilterOptions) => {
    return api.getMany<NotificationSchema>({
      path: '/notification',
      filterOptions,
    });
  },
  markAsRead: async (notificationId: string) => {
    return api.patch<NotificationActionResponse>({
      path: `/notification/mark-as-read/${notificationId}`,
    });
  },
  markAllAsRead: async () => {
    return api.patch<NotificationActionResponse>({
      path: '/notification/mark-all-as-read',
    });
  },
  delete: async (notificationId: string) => {
    return api.delete<NotificationActionResponse>({
      path: `/notification/delete/${notificationId}`,
    });
  },
  deleteAll: async () => {
    return api.delete<NotificationActionResponse>({
      path: '/notification/delete-all',
    });
  },
};
