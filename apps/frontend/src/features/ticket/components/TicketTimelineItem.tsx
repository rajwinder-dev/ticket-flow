import { cn } from "@/lib/utils";
import type { ticketAction, TicketTransitionSchema } from "@repo/schemas";
import { AlertTriangle, Clock, User } from "lucide-react";
import { formatDateTime } from "../utils";
import { EventBody } from "./EventBody";

const actionMeta: Record<ticketAction, { icon: React.ReactNode; dotClass: string; label: string }> =
  {
    STATUS_CHANGED: {
      icon: <Clock size={14} strokeWidth={1.8} />,
      dotClass: "text-blue-600 border border-blue-300 dark:text-blue-400 dark:border-blue-800",
      label: "Status changed",
    },

    PRIORITY_CHANGED: {
      icon: <AlertTriangle size={14} strokeWidth={1.8} />,
      dotClass: "text-amber-600 border border-amber-300 dark:text-amber-400 dark:border-amber-800",
      label: "Priority updated",
    },

    ESCALATED: {
      icon: <AlertTriangle size={14} strokeWidth={2} />,
      dotClass: "text-rose-600 border border-rose-300 dark:text-rose-400 dark:border-rose-800",
      label: "Ticket escalated",
    },

    ASSIGNED: {
      icon: <User size={14} strokeWidth={1.8} />,
      dotClass:
        "text-violet-600 border border-violet-300 dark:text-violet-400 dark:border-violet-800",
      label: "Agent assigned",
    },

    NOTE_ADDED: {
      icon: <Clock size={14} strokeWidth={1.5} />,
      dotClass: "text-slate-500 border border-stone-300 dark:text-slate-400 dark:border-slate-700",
      label: "Note added",
    },
  };
export function TimelineItem({
  event,
  isLast,
}: {
  event: TicketTransitionSchema;
  isLast: boolean;
}) {
  const meta = actionMeta[event.action] ?? actionMeta.NOTE_ADDED;

  return (
    <div className="flex gap-3">
      {/* Left: dot + connector line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            meta.dotClass,
          )}
        >
          {meta.icon}
        </div>
        {!isLast && <div className="bg-border/60 mt-1 min-h-[20px] w-px flex-1" />}
      </div>

      {/* Right: content */}
      <div className={cn("flex-1 pb-4", isLast && "pb-0")}>
        <div className="flex items-start justify-between gap-2">
          <span className="text-foreground pt-1.5 text-sm leading-none font-medium">
            {meta.label}
          </span>
          <time className="text-muted-foreground shrink-0 pt-1.5 text-xs whitespace-nowrap">
            {event.createdAt && formatDateTime(event.createdAt)}
          </time>
        </div>
        <EventBody event={event} />
      </div>
    </div>
  );
}
