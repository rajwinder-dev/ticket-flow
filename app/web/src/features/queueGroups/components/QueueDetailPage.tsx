import QueryBoundary from "@/components/QueryError";
import { Skeleton } from "@/components/ui/skeleton"; // Import shadcn skeleton
import { formatDate } from "@/lib/utils";
import { useParams } from "react-router";
import { QueueAgentTable } from "./queue/QueueAgentTable";
import QueueMatrices from "./queue/QueueMatrices";
import { QueueTicketTable } from "./queue/QueueTicketTable";
import { useQueue } from "@org/core";

const QueueDetailPage = () => {
  const { queueId } = useParams();
  const { queuesDetails, queueDetailsError, queueSummaryError, isLoadingDetails } = useQueue({
    queueId,
  });

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      {/* ── Header ── */}
      <QueryBoundary error={queueDetailsError} description="details not allowed">
        <div className="bg-background flex shrink-0 items-start justify-between gap-4 border-b px-6 py-4">
          <div>
            {isLoadingDetails ? (
              // Structured skeleton matching the exact layout hierarchy of the header elements
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-32" /> {/* Breadcrumb placeholder */}
                <Skeleton className="h-7 w-56" /> {/* Queue Title placeholder */}
                <Skeleton className="h-4 w-64" /> {/* Meta metadata details line placeholder */}
              </div>
            ) : (
              <>
                <p className="text-muted-foreground font-mono text-xs">
                  Queues /{" "}
                  <span className="font-medium text-orange-600">{queuesDetails?.data.id}</span>
                </p>
                <h1 className="mt-0.5 text-xl font-semibold tracking-tight">
                  {queuesDetails?.data.name}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {queuesDetails?.data.queueGroup?.name} · Created{" "}
                  {queuesDetails?.data.createdAt && formatDate(queuesDetails?.data.createdAt)}
                </p>
              </>
            )}
          </div>
        </div>
      </QueryBoundary>

      {/* ── Stats strip ── */}
      <QueryBoundary error={queueSummaryError} description="Summary not allowed">
        {/* Pass down loading state if matrices depend on parent fetching */}
        <QueueMatrices />
      </QueryBoundary>

      {/* ── Two-column body ── */}
      <div className="flex flex-1 divide-x overflow-hidden">
        {/* ── LEFT: Tickets ── */}
        <QueueTicketTable />

        {/* ── RIGHT: Agents ── */}
        <QueueAgentTable />
      </div>
    </div>
  );
};

export default QueueDetailPage;
