import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useTicket } from "../hooks";
import { TimelineItem } from "./TicketTimelineItem";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TransitionHistoryProps {
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── Color maps ───────────────────────────────────────────────────────────────

// ─── Micro icons (inline SVG, no extra deps) ──────────────────────────────────

// ─── Sub-components ───────────────────────────────────────────────────────────

// ─── Event body ───────────────────────────────────────────────────────────────

// ─── Timeline item ────────────────────────────────────────────────────────────

// ─── Main component ───────────────────────────────────────────────────────────

export function TransitionHistory({ className }: TransitionHistoryProps) {
  const { ticketTransitions, isLoadingTicketTransitions } = useTicket();
  if (isLoadingTicketTransitions) return <Spinner />;
  if (!ticketTransitions?.data.length)
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Transition History</CardTitle>
          <CardDescription>Recent ticket activity timeline</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-6 text-center text-sm">No activity yet.</p>
        </CardContent>
      </Card>
    );

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle>Transition History</CardTitle>
        <CardDescription>Recent ticket activity timeline</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {ticketTransitions.data.map((event, i) => (
            <TimelineItem
              key={`${event.action}-${event.createdAt}-${i}`}
              event={event}
              isLast={i === ticketTransitions.total - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
