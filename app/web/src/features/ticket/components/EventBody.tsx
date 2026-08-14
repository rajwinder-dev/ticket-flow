import type { TicketTransitionSchema } from "@org/zod";
import { ArrowRight } from "lucide-react";
import { TicketStatusBadge } from "./ui/TicketStatusBadge";
import { PriorityBadge } from "./ui/PriorityBadge";
import { AgentChip } from "./ui/AgentChip";
import { QueueTag } from "./ui/QueueTag";
import { ReasonBadge } from "./ui/ReasonBadge";
export function EventBody({ event }: { event: TicketTransitionSchema }) {
  if (event.action === "STATUS_CHANGED" && event.fromStatus && event.toStatus) {
    return (
      <div className="mt-1 flex flex-wrap items-center gap-1.5">
        <TicketStatusBadge status={event.fromStatus} />
        <ArrowRight size={14} />
        <TicketStatusBadge status={event.toStatus} />
      </div>
    );
  }

  if (event.action === "PRIORITY_CHANGED" && event.fromPriority && event.toPriority) {
    return (
      <div className="mt-1 flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={event.fromPriority} />
        <ArrowRight size={14} />
        <PriorityBadge priority={event.toPriority} />
      </div>
    );
  }

  if (event.action === "ESCALATED") {
    return (
      <div className="mt-1 space-y-1.5">
        {(event.fromQueue || event.toQueue) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {event.fromQueue?.name && <QueueTag name={event.fromQueue.name} />}
            <ArrowRight size="14" />
            {event.toQueue?.name && <QueueTag name={event.toQueue.name} />}
            {event.escalationReason && <ReasonBadge reason={event.escalationReason} />}
          </div>
        )}
        {(event.fromAgent || event.toAgent) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {event.fromAgent?.name && <AgentChip username={event.fromAgent.name} />}
            <ArrowRight size="14" />
            {event.toAgent?.name && <AgentChip username={event.toAgent.name} />}
          </div>
        )}
      </div>
    );
  }

  if (event.action === "NOTE_ADDED" && event.note) {
    return (
      <p className="text-muted-foreground bg-muted/60 border-border/40 mt-1 rounded-md border px-2.5 py-1.5 text-xs italic">
        "{event.note}"
      </p>
    );
  }

  return null;
}
