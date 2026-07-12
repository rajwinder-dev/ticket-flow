import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TicketPriority } from "@org/zod";

const priorityVariant: Record<TicketPriority, { label: string; className: string }> = {
  LOW: {
    label: "Low",
    className: "border border-stone-300 dark:border-slate-700",
  },

  MEDIUM: {
    label: "Medium",
    className: "border border-sky-300 dark:border-blue-800",
  },

  HIGH: {
    label: "High",
    className: "border border-orange-300 dark:border-orange-800",
  },

  URGENT: {
    label: "Urgent",
    className: "border border-red-300 dark:border-red-800",
  },
};
export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const v = priorityVariant[priority];
  return (
    <Badge variant="outline" className={cn("px-2 py-0.5 text-xs font-medium", v.className)}>
      {v.label}
    </Badge>
  );
}
