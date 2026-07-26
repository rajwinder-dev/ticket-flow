import { formatDistanceToNow } from 'date-fns';
import {
  SettingsIcon,
  CheckIcon,
  MoreVerticalIcon,
  Trash2Icon,
  type LucideIcon,
  BellIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationSchema } from '@org/zod';

import {
  TicketIcon,
  ShieldIcon,
  UserIcon,
  UsersIcon,
  FolderIcon,
  ListOrderedIcon,
  Building2Icon,
  BriefcaseIcon,
  MailIcon,
} from 'lucide-react';
const typeConfig: Partial<
  Record<NotificationSchema['type'], { icon: LucideIcon; className: string }>
> = {
  TICKET: { icon: TicketIcon, className: 'text-blue-500 bg-blue-500/10' },
  RBAC: { icon: ShieldIcon, className: 'text-purple-500 bg-purple-500/10' },
  USER: { icon: UserIcon, className: 'text-blue-500 bg-blue-500/10' },
  MEMBER: { icon: UsersIcon, className: 'text-violet-500 bg-violet-500/10' },
  GROUP: { icon: FolderIcon, className: 'text-violet-500 bg-violet-500/10' },
  QUEUE: { icon: ListOrderedIcon, className: 'text-amber-500 bg-amber-500/10' },
  ORGANIZATION: {
    icon: Building2Icon,
    className: 'text-emerald-500 bg-emerald-500/10',
  },
  CUSTOMER: {
    icon: BriefcaseIcon,
    className: 'text-emerald-500 bg-emerald-500/10',
  },
  EMAIL: { icon: MailIcon, className: 'text-blue-500 bg-blue-500/10' },
  SYSTEM: { icon: SettingsIcon, className: 'text-muted-foreground bg-muted' },
};

const DEFAULT_TYPE_CONFIG: { icon: LucideIcon; className: string } = {
  icon: BellIcon,
  className: 'text-muted-foreground bg-muted',
};

interface NotificationCardProps {
  notification: NotificationSchema;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onTicketClick?: (ticketId: string) => void;
  isMarkingAsRead?: boolean;
  isDeleting?: boolean;
}

export function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  onTicketClick,
  isMarkingAsRead,
  isDeleting,
}: NotificationCardProps) {
    const { icon: Icon, className: iconClassName } =
    typeConfig[notification.type] ?? DEFAULT_TYPE_CONFIG;
  const { isRead, actor, ticket } = notification;
  return (
    <div
      className={cn(
        'group relative flex gap-3 rounded-lg border p-3 transition-colors',
        isRead
          ? 'border-transparent bg-transparent'
          : 'border-border bg-muted/40',
      )}
    >
      {!isRead && (
        <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
      )}

      {actor ? (
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={actor.image ?? undefined} alt={actor.name} />
          <AvatarFallback className="text-xs">
            {actor.name
              .split(' ')
              .map((part) => part[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
            iconClassName,
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      )}

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm leading-none',
              isRead
                ? 'font-normal text-muted-foreground'
                : 'font-medium text-foreground',
            )}
          >
            {notification.title}
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
              >
                <MoreVerticalIcon className="h-3.5 w-3.5" />
                <span className="sr-only">Notification actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {!isRead && (
                <DropdownMenuItem
                  disabled={isMarkingAsRead}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Mark as read
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                disabled={isDeleting}
                onClick={() => onDelete(notification.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {notification.message}
        </p>

        <div className="flex items-center gap-2 pt-0.5">
          {ticket && (
            <Badge
              variant="outline"
              className="h-5 cursor-pointer gap-1 rounded-md px-1.5 text-[11px] font-normal hover:bg-muted"
              onClick={() => onTicketClick?.(ticket.id)}
            >
              {ticket.code}
            </Badge>
          )}
          <p className="text-xs text-muted-foreground/70">
            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}
