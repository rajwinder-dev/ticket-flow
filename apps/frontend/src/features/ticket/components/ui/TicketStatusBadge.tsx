import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TicketStatus } from "@repo/schemas";
const statusVariant: Record<TicketStatus, { label: string; className: string }> = {
  OPEN: {
    label: "Open",
    className: "border border-sky-300 dark:border-blue-800",
  },

  IN_PROGRESS: {
    label: "In Progress",
    className: "border border-amber-300 dark:border-amber-800",
  },

  ON_HOLD: {
    label: "On Hold",
    className: "border border-yellow-300 dark:border-yellow-800",
  },

  RESOLVED: {
    label: "Resolved",
    className: "border border-emerald-300 dark:border-emerald-800",
  },

  REOPENED: {
    label: "Reopened",
    className: "border border-rose-300 dark:border-rose-800",
  },

  ESCALATED: {
    label: "Escalated",
    className: "border border-orange-300 dark:border-orange-800",
  },

  CLOSED: {
    label: "Closed",
    className: "border border-stone-300 dark:border-slate-700",
  },
};
// ─── Types ─────────────────────────────────
export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const v = statusVariant[status];
  return (
    <Badge variant="outline" className={cn("px-2 py-0.5 text-xs font-medium", v.className)}>
      {v.label}
    </Badge>
  );
}
