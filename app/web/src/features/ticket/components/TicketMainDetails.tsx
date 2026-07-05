import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton"; // Import shadcn skeleton
import { useTicket, formatDateTime } from "@org/core";

const TicketMainDetails = () => {
  const { ticketDetails, isLoadingTicketDetails } = useTicket();

  return (
    <Card className="p-4 lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-semibold">Description</CardTitle>
        <CardDescription>Primary ticket information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoadingTicketDetails ? (
          // Multi-line layout description text skeleton blocks
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ) : (
          // Fixed structural nesting error (changed from paragraph tag to container div)
          <div className="text-sm leading-6">
            {ticketDetails?.data.description ? (
              <div dangerouslySetInnerHTML={{ __html: ticketDetails?.data.description }} />
            ) : (
              <span className="text-muted-foreground italic">No description provided.</span>
            )}
          </div>
        )}

        <Separator />

        <div className="grid gap-3 text-sm md:grid-cols-2">
          {/* Reported by Field */}
          <div>
            <p className="text-muted-foreground">Reported by</p>
            {isLoadingTicketDetails ? (
              <Skeleton className="mt-1 h-4 w-28" />
            ) : (
              <p className="font-medium">{ticketDetails?.data.customer?.name ?? "N/A"}</p>
            )}
          </div>

          {/* Assignee Field */}
          <div>
            <p className="text-muted-foreground">Assignee</p>
            {isLoadingTicketDetails ? (
              <Skeleton className="mt-1 h-4 w-24" />
            ) : (
              <p className="font-medium">
                {ticketDetails?.data.assignedToUser?.name ?? "Unassigned"}
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
                  : "N/A"}
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
                  : "N/A"}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketMainDetails;
