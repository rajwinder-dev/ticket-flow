import type { FilterOptions } from '@org/web-utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from './api.js';

interface UseNotificationProps {
  userId: string | undefined;
  filterOptions?: FilterOptions;
}

export const useNotification = ({
  userId,
  filterOptions,
}: UseNotificationProps) => {
  const queryClient = useQueryClient();
  const {
    data: notificationData,
    isLoading: isLoadingNotifications,
    error: notificationError,
  } = useQuery({
    queryKey: ['notification', { userId }, filterOptions],
    queryFn: () => notificationApi.getAll(filterOptions),
    enabled: !!userId,
  });

  const { mutate: markAsRead, isPending: isMarkingAsRead } = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification', { userId }] });
    },
  });
  const { mutate: markAllAsRead, isPending: isMarkingAllAsRead } = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification', { userId }] });
    },
  });
  const { mutate: deleteNotification, isPending: isDeletingNotification } =
    useMutation({
      mutationFn: notificationApi.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['notification', { userId }],
        });
      },
    });
  const {
    mutate: deleteAllNotifications,
    isPending: isDeletingAllNotifications,
  } = useMutation({
    mutationFn: notificationApi.deleteAll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification', { userId }] });
    },
  });

  return {
    notificationData,
    isLoadingNotifications,
    notificationError,
    markAsRead,
    isMarkingAsRead,
    markAllAsRead,
    isMarkingAllAsRead,
    deleteNotification,
    isDeletingNotification,
    deleteAllNotifications,
    isDeletingAllNotifications,
  };
};
