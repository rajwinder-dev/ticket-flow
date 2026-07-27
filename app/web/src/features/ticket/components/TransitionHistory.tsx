import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // Import shadcn skeleton
import { useTicket } from '@org/core';
import { TimelineItem } from './TicketTimelineItem';
import { useParams } from 'react-router';

interface TransitionHistoryProps {
  className?: string;
}

export function TransitionHistory({ className }: TransitionHistoryProps) {
  const { orgId, ticketId } = useParams();
  const { ticketTransitions, isLoadingTicketTransitions } = useTicket({
    orgId,
    ticketId,

  });
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle>Transition History</CardTitle>
        <CardDescription>Recent ticket activity timeline</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingTicketTransitions ? (
          // Proportional vertical timeline tracker layout skeletons
          <div className="space-y-6 pl-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="relative flex items-start gap-4">
                {/* Simulated vertical layout connectors & dot beads */}
                <div className="flex flex-col items-center">
                  <Skeleton className="bg-muted-foreground/30 h-2.5 w-2.5 rounded-full" />
                  {index < 2 && (
                    <Skeleton className="bg-muted/40 mt-2 h-12 w-0.5" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5 pt-0.5">
                  <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-4 w-32" />{' '}
                    {/* Event Action Name label placeholder */}
                    <Skeleton className="h-3 w-16" />{' '}
                    {/* Relative timestamp metric tag placeholder */}
                  </div>
                  <Skeleton className="h-3.5 w-5/6" />{' '}
                  {/* Description message or metadata string */}
                </div>
              </div>
            ))}
          </div>
        ) : !ticketTransitions?.data || ticketTransitions.data.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm italic">
            No activity yet.
          </p>
        ) : (
          <div className="space-y-0">
            {ticketTransitions.data.map((event, i) => (
              <TimelineItem
                key={`${event.action}-${event.createdAt}-${i}`}
                event={event}
                isLast={i === ticketTransitions.data.length - 1} // Safely fall back to mapped data length index
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
