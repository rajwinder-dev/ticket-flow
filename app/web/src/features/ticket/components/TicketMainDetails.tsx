import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useTicket, formatDateTime } from '@org/core';
import { useParams } from 'react-router';
import { TicketStatusCell } from './TicketStatusCell';
import { TicketPriorityCell } from './TicketPriorityCell';
import { Badge, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const TicketMainDetails = () => {
  const { orgId, ticketId } = useParams();
  const {
    ticketDetails,
    isLoadingTicketDetails,
    generateTicketSummary,
    isGeneratingTicketSummary,
  } = useTicket({
    orgId,
    ticketId,
  });

  const hasSummary = Boolean(ticketDetails?.data.summary);

  const handleGenerateSummary = async () => {
    if (!ticketId) return;
    generateTicketSummary(
      { ticketId },
      {
        onSuccess: () => {
          toast.success('Ticket summary generated successfully');
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Card className="p-4 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="font-heading text-lg font-semibold">
            Description
          </CardTitle>
          <CardDescription>Primary ticket information</CardDescription>
        </div>
        {!ticketDetails?.data.summary && (
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={handleGenerateSummary}
            disabled={isGeneratingTicketSummary}
          >
            <Sparkles className="h-4 w-4" />
            {isGeneratingTicketSummary
              ? 'Generating...'
              : 'Generate AI Summary'}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Summary */}
        {isLoadingTicketDetails ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          hasSummary && (
            <Card className="w-full border-muted shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <CardTitle className="text-base">AI Summary</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Generated just now
                    </p>
                  </div>
                </div>

                <Badge className="gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Accurate
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {ticketDetails?.data.summary}
                </p>
                {/* <div className="flex gap-2"> */}
                {/*   <Button */}
                {/*     size="sm" */}
                {/*     variant="outline" */}
                {/*     onClick={handleGenerateSummary} */}
                {/*     disabled={isGeneratingTicketSummary} */}
                {/*   > */}
                {/*     <RefreshCw className="mr-2 h-4 w-4" /> */}
                {/*     {isGeneratingTicketSummary */}
                {/*       ? 'Regenerating...' */}
                {/*       : 'Regenerate'} */}
                {/*   </Button> */}
                {/* </div> */}
              </CardContent>
            </Card>
          )
        )}

        <Separator />

        {isLoadingTicketDetails ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ) : (
          <div className="text-sm leading-6">
            {ticketDetails?.data.description ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: ticketDetails?.data.description,
                }}
              />
            ) : (
              <span className="text-muted-foreground italic">
                No description provided.
              </span>
            )}
          </div>
        )}

        <Separator />

        <div className="grid gap-4 text-sm md:grid-cols-2">
          {/* Reported by Field */}
          <div>
            <p className="text-muted-foreground">Reported by</p>
            {isLoadingTicketDetails ? (
              <Skeleton className="mt-1 h-4 w-28" />
            ) : (
              <p className="font-medium">
                {ticketDetails?.data.customer?.name ?? 'N/A'}
              </p>
            )}
          </div>

          {/* Assignee Field */}
          <div>
            <p className="text-muted-foreground">Assignee</p>
            {isLoadingTicketDetails ? (
              <Skeleton className="mt-1 h-4 w-24" />
            ) : (
              <p className="font-medium">
                {ticketDetails?.data.assignedToUser?.name ?? 'Unassigned'}
              </p>
            )}
          </div>

          {/* Created Field */}
          <div>
            <p className="text-muted-foreground">Created</p>
            {isLoadingTicketDetails ? (
              <Skeleton className="mt-1 h-4 w-36" />
            ) : (
              <p className="font-medium">
                {ticketDetails?.data.createdAt
                  ? formatDateTime(ticketDetails?.data.createdAt)
                  : 'N/A'}
              </p>
            )}
          </div>

          {/* Updated Field */}
          <div>
            <p className="text-muted-foreground">Updated</p>
            {isLoadingTicketDetails ? (
              <Skeleton className="mt-1 h-4 w-36" />
            ) : (
              <p className="font-medium">
                {ticketDetails?.data.updatedAt
                  ? formatDateTime(ticketDetails?.data.updatedAt)
                  : 'N/A'}
              </p>
            )}
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Status</p>
            {isLoadingTicketDetails ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              ticketDetails?.data && (
                <TicketStatusCell ticket={ticketDetails?.data} />
              )
            )}
          </div>

          {/* Priority Field */}
          <div>
            <p className="text-muted-foreground mb-1">Priority</p>
            {isLoadingTicketDetails ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              ticketDetails?.data && (
                <TicketPriorityCell ticket={ticketDetails?.data} />
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketMainDetails;
