import { Skeleton } from "@/components/ui/skeleton"; // Import shadcn skeleton
import { useQueue } from "@org/core";
import { useParams } from "react-router";

const QueueMatrices = () => {
  const { queueId } = useParams();
  // Extracted loading state directly from your shared feature hook container
  const { queueSummary, isLoadingQueueSummary } = useQueue({ queueId });

  const metrics = [
    { label: "Total Tickets", value: queueSummary?.data.totalTickets },
    { label: "Open", value: queueSummary?.data.openTickets },
    { label: "High Priority", value: queueSummary?.data.highPriorityTickets },
    { label: "Active Agents", value: queueSummary?.data.activeAgents },
  ];

  return (
    <div className="grid shrink-0 grid-cols-2 divide-x divide-y border-b sm:grid-cols-4 sm:divide-y-0">
      {metrics.map((stat, i) => (
        <div key={i} className="flex items-center gap-2 p-4">
          <p className="text-muted-foreground text-sm">{stat.label}:</p>
          {isLoadingQueueSummary ? (
            <Skeleton className="bg-muted/60 h-5 w-8 rounded" /> // Proportional tabular text number line placeholder
          ) : (
            <p className="font-semibold tracking-tight text-orange-600 tabular-nums">
              {stat.value ?? 0}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default QueueMatrices;
