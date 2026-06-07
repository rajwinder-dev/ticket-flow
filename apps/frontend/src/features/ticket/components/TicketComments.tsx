import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Import shadcn skeleton
import { useTicket } from "../hooks";
import { formatDateTime } from "../utils";

const TicketComments = () => {
  const { ticketComments, isLoadingTicketComments } = useTicket();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
        <CardDescription>Conversation on this ticket</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoadingTicketComments ? (
          // Renders an array of structured comment card skeletons to match formatting layout
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2 rounded-md border p-3">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-4 w-24" /> {/* Commenter handle placeholder */}
                <Skeleton className="h-3 w-32" /> {/* Created date metric placeholder */}
              </div>
              <div className="space-y-1.5 pt-1">
                <Skeleton className="h-3.5 w-full" /> {/* Comment text row 1 */}
                <Skeleton className="h-3.5 w-5/6" /> {/* Comment text row 2 */}
              </div>
            </div>
          ))
        ) : ticketComments?.data.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-sm italic">
            No comments posted on this ticket yet.
          </div>
        ) : (
          ticketComments?.data.map((comment) => (
            <div key={comment.id} className="space-y-1 rounded-md border p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{comment.author.name}</p>
                <p className="text-muted-foreground text-xs">{formatDateTime(comment.createdAt)}</p>
              </div>
              <p className="text-foreground text-sm">{comment.comment}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TicketComments;
