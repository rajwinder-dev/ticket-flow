import { Link, useParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import PageHeader from "@/components/PageHeader";
import DashboardMatrices from "./DashbaordMatrices";
import { useDashboard } from "./hooks";
import OnboardingBanner from "@/components/OnboardingBanner";

const DashboardPage = () => {
  const { orgId } = useParams();
  const { recentTickets, summary } = useDashboard();
  const Remaining = summary
    ? summary?.data.IN_PROGRESS + summary?.data.ON_HOLD + summary?.data.REOPENED
    : 0;
  const resolveRate = summary?.data.TOTAL
    ? Math.round(((summary?.data.RESOLVED + summary?.data.RESOLVED) / summary.data.TOTAL) * 100)
    : 0;

  return (
    <div className="">
      <PageHeader
        title="Dashboard"
        description="MVP overview of support workload, progress, and recent updates."
      >
        <Button asChild>
          <Link to={`/org/${orgId}/ticket`}>View all tickets</Link>
        </Button>
      </PageHeader>
      <OnboardingBanner />
      <DashboardMatrices />
      <div className="grid lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Ticket Activity</CardTitle>
            <CardDescription>Latest updated tickets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTickets?.data.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tickets available yet.</p>
            ) : (
              recentTickets?.data.map((ticket) => (
                <div key={ticket.id} className="space-y-2 rounded-md border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs">{ticket.id}</p>
                    <Badge variant="outline">{ticket.priority}</Badge>
                  </div>
                  <p className="text-sm font-medium">{ticket.subject}</p>
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <span>{ticket.status}</span>
                    <span>-</span>
                    <span>{ticket.assignedToUser?.username}</span>
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
              <p className="mb-2 text-sm font-medium">{resolveRate}% completed</p>
              <Progress value={resolveRate} />
            </div>
            <Separator />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resolved</span>
                <span>{summary?.data.RESOLVED}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Closed</span>
                <span>{summary?.data.CLOSED}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining</span>
                <span>{Remaining}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
