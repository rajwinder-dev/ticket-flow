import { useMemo } from "react";
import { Link, useParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { EMPLOYEES, useTicketStore } from "../ticketStore";

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const TicketDetails = () => {
  const { id, orgId } = useParams();
  const tickets = useTicketStore((state) => state.tickets);

  const ticket = useMemo(() => tickets.find((item) => item.id === id), [tickets, id]);
  const assignee = useMemo(
    () => EMPLOYEES.find((employee) => employee.id === ticket?.assigneeId),
    [ticket?.assigneeId],
  );

  const timeline = useMemo(() => {
    if (!ticket) return [];

    const events = [
      {
        key: `${ticket.id}-created`,
        title: "Ticket created",
        description: `${ticket.reportedBy} created this ticket`,
        at: ticket.createdAt,
      },
      ...ticket.comments.map((comment) => ({
        key: comment.id,
        title: "Comment added",
        description: `${comment.author}: ${comment.text}`,
        at: comment.createdAt,
      })),
      {
        key: `${ticket.id}-updated`,
        title: "Latest update",
        description: `Ticket is currently "${ticket.status}" with "${ticket.priority}" priority`,
        at: ticket.updatedAt,
      },
    ];

    return events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  }, [ticket]);

  if (!ticket) {
    return (
      <div className="space-y-4 p-6">
        <h1 className="text-xl font-semibold">Ticket details</h1>
        <p className="text-muted-foreground text-sm">Ticket not found.</p>
        <Button asChild variant="outline">
          <Link to={`/org/${orgId}/ticket`}>Back to tickets</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-muted-foreground font-mono text-xs">{ticket.id}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{ticket.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{ticket.status}</Badge>
            <Badge variant="secondary">{ticket.priority}</Badge>
            <Badge variant="outline">{ticket.type}</Badge>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link to={`/org/${orgId}/ticket`}>Back</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription>Primary ticket information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-6">{ticket.description}</p>
            <Separator />
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Reported by</p>
                <p className="font-medium">{ticket.reportedBy}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Assignee</p>
                <p className="font-medium">{assignee?.name ?? "Unassigned"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium">{formatDateTime(ticket.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Updated</p>
                <p className="font-medium">{formatDateTime(ticket.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Ticket labels</CardDescription>
          </CardHeader>
          <CardContent>
            {ticket.tags.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tags</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {ticket.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
            <CardDescription>Conversation on this ticket</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ticket.comments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No comments yet.</p>
            ) : (
              ticket.comments.map((comment) => (
                <div key={comment.id} className="space-y-1 rounded-md border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{comment.author}</p>
                    <p className="text-muted-foreground text-xs">{formatDateTime(comment.createdAt)}</p>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

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

export default TicketDetails;
