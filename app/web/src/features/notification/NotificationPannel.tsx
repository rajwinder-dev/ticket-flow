import { BellIcon, CheckCheckIcon, Trash2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { useNotification } from '@org/core';
import { NotificationSchema } from '@org/zod';
import { NotificationCard } from './NotificationCard';

interface NotificationPanelProps {
  userId: string | undefined;
  onTicketClick?: (ticketId: string) => void;
}

export function NotificationPanel({ userId, onTicketClick }: NotificationPanelProps) {
  const {
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
  } = useNotification({ userId });

  const notifications: NotificationSchema[] = notificationData?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className={cn(
                'absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none',
              )}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Open notifications</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="center" className="w-96 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Notifications</p>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="rounded-full px-2 text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs text-muted-foreground"
              disabled={unreadCount === 0 || isMarkingAllAsRead}
              onClick={() => markAllAsRead()}
            >
              <CheckCheckIcon className="h-3.5 w-3.5" />
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-destructive"
              disabled={notifications.length === 0 || isDeletingAllNotifications}
              onClick={() => deleteAllNotifications()}
            >
              <Trash2Icon className="h-3.5 w-3.5" />
              Clear all
            </Button>
          </div>
        </div>

        <Separator />

        <ScrollArea className="h-96">
          <div className="space-y-1 p-2">
            {isLoadingNotifications && (
              <div className="space-y-2 p-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-2/3" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoadingNotifications && notificationError && (
              <div className="flex flex-col items-center gap-1 py-10 text-center">
                <p className="text-sm font-medium text-destructive">
                  Couldn't load notifications
                </p>
                <p className="text-xs text-muted-foreground">
                  Something went wrong. Try again in a moment.
                </p>
              </div>
            )}

            {!isLoadingNotifications && !notificationError && notifications.length === 0 && (
              <div className="flex flex-col items-center gap-1 py-10 text-center">
                <BellIcon className="mb-1 h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm font-medium">You're all caught up</p>
                <p className="text-xs text-muted-foreground">
                  New notifications will show up here.
                </p>
              </div>
            )}

            {!isLoadingNotifications &&
              !notificationError &&
              notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={(id) => markAsRead(id)}
                  onDelete={(id) => deleteNotification(id)}
                  onTicketClick={onTicketClick}
                  isMarkingAsRead={isMarkingAsRead}
                  isDeleting={isDeletingNotification}
                />
              ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
