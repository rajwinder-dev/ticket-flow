import { Link, useParams } from 'react-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton'; // Import the shadcn skeleton component

import PageHeader from '@/components/PageHeader';
import DashboardMatrices from './DashbaordMatrices';
import OnboardingBanner from '@/components/OnboardingBanner';
import { useDashboard } from '@org/core';

const DashboardPage = () => {
  const { orgId } = useParams();
  const { recentTickets, summary, isLoadingSummary, isLoadingRecentTicket } =
    useDashboard({ orgId });

  // Calculate remaining open/active work
  const Remaining = summary
    ? (summary?.data.IN_PROGRESS || 0) +
      (summary?.data.ON_HOLD || 0) +
      (summary?.data.REOPENED || 0)
    : 0;

  // Fixed the math bug here: changed RESOLVED + RESOLVED to RESOLVED + CLOSED
  const resolveRate = summary?.data.TOTAL
    ? Math.round(
        (((summary?.data.RESOLVED || 0) + (summary?.data.CLOSED || 0)) /
          summary.data.TOTAL) *
          100,
      )
    : 0;

  return (
    <div>
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
      <div className="grid grid-cols-1 items-stretch  lg:grid-cols-3">
        {/* Recent Ticket Activity Card */}
        <Card className="flex flex-col lg:col-span-2 order-1 lg:order-0">
          <CardHeader>
            <CardTitle>Recent Ticket Activity</CardTitle>
            <CardDescription>Latest updated tickets</CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col">
            <div className="max-h-[16rem] flex-1 space-y-3 overflow-auto pr-1">
              {isLoadingRecentTicket ? (
                // Loading state: Loop through 3 placeholder ticket layouts
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2 rounded-md border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <Skeleton className="h-4 w-24" /> {/* Ticket ID */}
                      <Skeleton className="h-5 w-14 rounded-full" />{' '}
                      {/* Priority Badge */}
                    </div>
                    <Skeleton className="h-5 w-3/4" /> {/* Ticket Subject */}
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-16" /> {/* Status */}
                      <Skeleton className="h-4 w-2" /> {/* Divider */}
                      <Skeleton className="h-4 w-24" /> {/* Assigned User */}
                    </div>
                  </div>
                ))
              ) : recentTickets?.data.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No tickets available yet.
                </p>
              ) : (
                recentTickets?.data.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="space-y-2 rounded-md border p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-mono text-xs">{ticket.id}</p>
                      <Badge variant="outline">{ticket.priority}</Badge>
                    </div>
                    <p className="text-sm font-medium break-words">
                      {ticket.subject}
                    </p>
                    <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                      <span>{ticket.status}</span>
                      <span>-</span>
                      <span>{ticket.assignedToUser?.name || 'Unassigned'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resolution Progress Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Resolution Progress</CardTitle>
            <CardDescription>Resolved + closed ratio</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {isLoadingSummary ? (
              // Loading state for Progress Sidepanel
              <div className="space-y-4">
                <div>
                  <Skeleton className="mb-2 h-5 w-28" /> {/* % text */}
                  <Skeleton className="h-3 w-full" /> {/* Progress Bar */}
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-14" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                </div>
              </div>
            ) : (
              // Content state once loaded
              <>
                <div>
                  <p className="mb-2 text-sm font-medium">
                    {resolveRate}% completed
                  </p>
                  <Progress value={resolveRate} />
                </div>
                <Separator />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resolved</span>
                    <span>{summary?.data.RESOLVED || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Closed</span>
                    <span>{summary?.data.CLOSED || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining</span>
                    <span>{Remaining}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
