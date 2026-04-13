import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTicket } from "../hooks";
import { formatDateTime } from "../utils";

const TicketComments = () => {
  const { ticketComments } = useTicket();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
        <CardDescription>Conversation on this ticket</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {ticketComments?.data.map((comment) => (
          <div key={comment.id} className="space-y-1 rounded-md border p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{comment.author.username}</p>
              <p className="text-muted-foreground text-xs">{formatDateTime(comment.createdAt)}</p>
            </div>
            <p className="text-sm">{comment.comment}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TicketComments;
