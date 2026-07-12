import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton'; // Import shadcn skeleton
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useTicket } from '@org/core';

const TicketDetailsHeader = () => {
  const { orgId, ticketId } = useParams();
  const { ticketDetails, isLoadingTicketDetails } = useTicket({
    orgId,
    ticketId,
  });
  const navigate = useNavigate();

  return (
    <div className="flex items-start justify-between gap-3 border-b p-4">
      <div className="flex-1 space-y-2">
        {isLoadingTicketDetails ? (
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-16 font-mono" />{' '}
            <Skeleton className="h-8 w-3/4 max-w-xl" />{' '}
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-5 w-14 rounded-full" />{' '}
              <Skeleton className="h-5 w-16 rounded-full" />{' '}
              <Skeleton className="h-5 w-20 rounded-full" />{' '}
            </div>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground font-mono text-xs">
              {ticketDetails?.data.code}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {ticketDetails?.data.subject}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{ticketDetails?.data.status}</Badge>
              <Badge variant="secondary">{ticketDetails?.data.priority}</Badge>
              <Badge variant="outline">{ticketDetails?.data.category}</Badge>
            </div>
          </>
        )}
      </div>

      <Button
        variant="secondary"
        onClick={() => navigate(-1)}
        disabled={isLoadingTicketDetails} // Safe control protection against rapid state re-entry
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
    </div>
  );
};

export default TicketDetailsHeader;
