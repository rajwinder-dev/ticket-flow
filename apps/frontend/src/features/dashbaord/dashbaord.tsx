import { useMemo } from "react";
import { Link, useParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import { EMPLOYEES, useTicketStore } from "../ticket/ticketStore";

const DashboardPage = () => {
  const { orgId } = useParams();
  const tickets = useTicketStore((state) => state.tickets);

  const data = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((ticket) => ticket.status === "open").length;
    const inProgress = tickets.filter((ticket) => ticket.status === "in progress").length;
    const resolved = tickets.filter((ticket) => ticket.status === "resolved").length;
    const closed = tickets.filter((ticket) => ticket.status === "closed").length;
    const critical = tickets.filter((ticket) => ticket.priority === "critical").length;

    const recent = [...tickets]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 5);

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      critical,
      recent,
      resolvedRate: total > 0 ? Math.round(((resolved + closed) / total) * 100) : 0,
    };
  }, [tickets]);

  const assigneeName = (assigneeId: string | null) =>
    EMPLOYEES.find((employee) => employee.id === assigneeId)?.name ?? "Unassigned";

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ticket Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            MVP overview of support workload, progress, and recent updates.
          </p>
        </div>
        <Button asChild>
          <Link to={`/org/${orgId}/ticket`}>View all tickets</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Total", value: data.total },
          { label: "Open", value: data.open },
          { label: "In Progress", value: data.inProgress },
          { label: "Resolved", value: data.resolved },
          { label: "Critical", value: data.critical },
        ].map((item) => (
          <Card key={item.label} size="sm">
            <CardHeader>
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-2xl">{item.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Ticket Activity</CardTitle>
            <CardDescription>Latest updated tickets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recent.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tickets available yet.</p>
            ) : (
              data.recent.map((ticket) => (
                <div key={ticket.id} className="space-y-2 rounded-md border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs">{ticket.id}</p>
                    <Badge variant="outline">{ticket.priority}</Badge>
                  </div>
                  <p className="text-sm font-medium">{ticket.title}</p>
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <span>{ticket.status}</span>
                    <span>-</span>
                    <span>{assigneeName(ticket.assigneeId)}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resolution Progress</CardTitle>
            <CardDescription>Resolved + closed ratio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">{data.resolvedRate}% completed</p>
              <Progress value={data.resolvedRate} />
            </div>
            <Separator />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resolved</span>
                <span>{data.resolved}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Closed</span>
                <span>{data.closed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining</span>
                <span>{data.open + data.inProgress}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
