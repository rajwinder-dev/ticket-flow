import { NotificationService } from './notification.service';

const {
  mockCreate,
  mockFindMany,
  mockCount,
  mockUpdateMany,
  mockInvlidUserQuery,
  mockLoggerInfo,
} = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
  mockUpdateMany: vi.fn(),
  mockInvlidUserQuery: vi.fn(),
  mockLoggerInfo: vi.fn(),
}));

vi.mock('@org/database', () => ({
  prisma: {
    notification: {
      create: mockCreate,
      findMany: mockFindMany,
      count: mockCount,
      updateMany: mockUpdateMany,
    },
  },
}));

vi.mock('../socket/socket.service', () => ({
  SocketService: {
    invlidUserQuery: mockInvlidUserQuery,
  },
}));

vi.mock('../../core/utils/logger', () => ({
  logger: {
    info: mockLoggerInfo,
  },
}));

describe('NotificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendNotification', () => {
    it('creates a notification and invalidates the recipient cache', async () => {
      mockCreate.mockResolvedValue({ id: 'notif-1', recipientId: 'user-2' });

      const result = await NotificationService.sendNotification({
        userId: 'user-1',
        recipientId: 'user-2',
        data: {
          title: 'Hi',
          message: 'You got a message',
          type: 'RBAC',
          channel: 'IN_APP',
        } as any,
      });

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          recipientId: 'user-2',
          title: 'Hi',
          message: 'You got a message',
          type: 'RBAC',
          channel: 'IN_APP',
        },
      });
      expect(mockInvlidUserQuery).toHaveBeenCalledWith({
        recipientId: 'user-2',
        keys: ['notification'],
      });
      expect(result).toEqual({ id: 'notif-1', recipientId: 'user-2' });
    });

    it('does nothing and logs when userId equals recipientId', async () => {
      const result = await NotificationService.sendNotification({
        userId: 'user-1',
        recipientId: 'user-1',
        data: {
          title: 'Hi',
          message: 'You got a message',
          type: 'RBAC',
          channel: 'IN_APP',
        } as any,
      });

      expect(mockLoggerInfo).toHaveBeenCalledWith(
        'cannot send notification to yourself',
      );
      expect(mockCreate).not.toHaveBeenCalled();
      expect(mockInvlidUserQuery).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('getNotifications', () => {
    it('returns paginated data alongside total and unread counts', async () => {
      const notifications = [{ id: 'notif-1' }, { id: 'notif-2' }];
      mockFindMany.mockResolvedValue(notifications);
      mockCount.mockResolvedValueOnce(2); // total
      mockCount.mockResolvedValueOnce(1); // unread

      const result = await NotificationService.getNotifications({
        userId: 'user-1',
        limit: 10,
        offset: 0,
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { recipientId: 'user-1', deleted: false },
          take: 10,
          skip: 0,
        }),
      );
      expect(mockCount).toHaveBeenNthCalledWith(1, {
        where: { recipientId: 'user-1', deleted: false },
      });
      expect(mockCount).toHaveBeenNthCalledWith(2, {
        where: { recipientId: 'user-1', deleted: false, isRead: false },
      });
      expect(result).toEqual({
        data: notifications,
        total: 2,
        unread: 1,
        limit: 10,
        offset: 0,
      });
    });
  });

  describe('markNotificationAsRead', () => {
    it('returns updated: true when a row was updated', async () => {
      mockUpdateMany.mockResolvedValue({ count: 1 });

      const result = await NotificationService.markNotificationAsRead({
        notificationId: 'notif-1',
        userId: 'user-1',
      });

      expect(mockUpdateMany).toHaveBeenCalledWith({
        where: { id: 'notif-1', recipientId: 'user-1', deleted: false },
        data: { readAt: expect.any(Date), isRead: true },
      });
      expect(result).toEqual({ updated: true });
    });

    it('returns updated: throw error when no rows were updated', async () => {
      mockUpdateMany.mockResolvedValue({ count: 0 });

      const result = NotificationService.markNotificationAsRead({
        notificationId: 'notif-1',
        userId: 'user-1',
      });

      expect(result).rejects.toThrow('Notification not found');
    });
  });

  describe('markAllNotificationsAsRead', () => {
    it('returns the number of notifications updated', async () => {
      mockUpdateMany.mockResolvedValue({ count: 4 });

      const result = await NotificationService.markAllNotificationsAsRead({
        userId: 'user-1',
      });

      expect(mockUpdateMany).toHaveBeenCalledWith({
        where: { recipientId: 'user-1', deleted: false, isRead: false },
        data: { readAt: expect.any(Date), isRead: true },
      });
      expect(result).toEqual({ updated: 4 });
    });
  });

  describe('deleteNotification', () => {
    it('returns deleted: true when a row was soft-deleted', async () => {
      mockUpdateMany.mockResolvedValue({ count: 1 });

      const result = await NotificationService.deleteNotification({
        notificationId: 'notif-1',
        userId: 'user-1',
      });

      expect(mockUpdateMany).toHaveBeenCalledWith({
        where: { id: 'notif-1', recipientId: 'user-1', deleted: false },
        data: { deleted: true, deletedAt: expect.any(Date) },
      });
      expect(result).toEqual({ deleted: true });
    });

    it('returns deleted: throw error when no row matched', async () => {
      mockUpdateMany.mockResolvedValue({ count: 0 });

      const result = NotificationService.deleteNotification({
        notificationId: 'notif-1',
        userId: 'user-1',
      });

      expect(result).rejects.toThrow('Notification not found');
    });
  });

  describe('deleteAllNotifications', () => {
    it('returns the number of notifications soft-deleted', async () => {
      mockUpdateMany.mockResolvedValue({ count: 3 });

      const result = await NotificationService.deleteAllNotifications({
        userId: 'user-1',
      });

      expect(mockUpdateMany).toHaveBeenCalledWith({
        where: { recipientId: 'user-1', deleted: false },
        data: { deleted: true, deletedAt: expect.any(Date) },
      });
      expect(result).toEqual({ deleted: 3 });
    });
  });
});
