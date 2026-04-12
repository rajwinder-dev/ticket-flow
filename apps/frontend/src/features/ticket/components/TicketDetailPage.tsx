import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router";
import { useTicket } from "../hooks";

// --- Static Mock Data ---
const MOCK_TICKET = {
  id: "TIC-8824",
  title: "Auth provider failing on production canary",
  status: "In Progress",
  priority: "High",
  type: "Bug",
  description:
    "The authentication provider is intermittently returning 500 errors during the token exchange flow. This seems to be affecting approximately 5% of users on the US-East-1 region. Investigation suggests a race condition in the cache layer.",
  reportedBy: "Sarah Jenkins",
  assigneeName: "Michael Scott",
  createdAt: "2024-05-12T10:30:00Z",
  updatedAt: "2024-05-12T14:20:00Z",
  tags: ["Production", "Auth", "Urgent"],
  comments: [
    {
      id: "1",
      author: "Michael Scott",
      text: "I've started investigating the logs. It looks like a timeout issue with the Redis cluster.",
      createdAt: "2024-05-12T11:45:00Z",
    },
    {
      id: "2",
      author: "Dwight Schrute",
      text: "I have checked the server uptime. Everything is fine on my end. Fact.",
      createdAt: "2024-05-12T13:00:00Z",
    },
  ],
};

const formatDateTime = (value: string | Date) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const TicketDetailPage = () => {
  // Pre-calculate timeline from static data
  const { ticketDetails, ticketComments } = useTicket();

  const navigate = useNavigate();
  const timeline = [
    {
      key: "created",
      title: "Ticket created",
      description: `${MOCK_TICKET.reportedBy} created this ticket`,
      at: MOCK_TICKET.createdAt,
    },
    ...MOCK_TICKET.comments.map((comment) => ({
      key: comment.id,
      title: "Comment added",
      description: `${comment.author}: ${comment.text}`,
      at: comment.createdAt,
    })),
    {
      key: "updated",
      title: "Latest update",
      description: `Ticket is currently "${MOCK_TICKET.status}" with "${MOCK_TICKET.priority}" priority`,
      at: MOCK_TICKET.updatedAt,
    },
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-muted-foreground font-mono text-xs">{ticketDetails?.data.code}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{ticketDetails?.data.subject}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{ticketDetails?.data.status}</Badge>
            <Badge variant="secondary">{ticketDetails?.data.priority}</Badge>
            <Badge variant="outline">{ticketDetails?.data.category}</Badge>
          </div>
        </div>
        <Button variant="default" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription>Primary ticket information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-6">{ticketDetails?.data.description}</p>
            <Separator />
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Reported by</p>
                <p className="font-medium">{ticketDetails?.data.customer?.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Assignee</p>
                <p className="font-medium">{ticketDetails?.data.assignedToUser?.username}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">
                  {ticketDetails?.data.createdAt && formatDateTime(ticketDetails?.data.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Updated</p>
                <p className="font-medium">
                  {ticketDetails?.data.createdAt && formatDateTime(ticketDetails?.data.updatedAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Ticket labels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {MOCK_TICKET.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Comments */}
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
                  <p className="text-muted-foreground text-xs">
                    {formatDateTime(comment.createdAt)}
                  </p>
                </div>
                <p className="text-sm">{comment.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle>Transition History</CardTitle>
            <CardDescription>Recent ticket activity timeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {timeline.map((event) => (
              <div key={event.key} className="rounded-md border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-muted-foreground text-xs">{formatDateTime(event.at)}</p>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">{event.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketDetailPage;
