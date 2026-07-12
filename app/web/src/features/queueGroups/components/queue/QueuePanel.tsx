import QueryBoundary from "@/components/QueryError";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Import shadcn skeleton
import { Inbox, Layers, Plus } from "lucide-react";
import { NoGroupSelected } from "../groups/NoGroupSelected";
import { QueueTable } from "./QueueTable";
import { useQueue, useQueueGroup, useQueueGroupStore } from "@org/core";
import { useParams } from "react-router";

interface QueuePanelProps {
  onAddQueue: () => void;
}

function QueueEmptyState({ onAddQueue }: { onAddQueue: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
      <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
        <Inbox className="text-muted-foreground h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold">No queues yet</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Add a queue to start routing tickets into this group
        </p>
      </div>
      <Button size="sm" variant="outline" onClick={onAddQueue} className="mt-1 gap-1.5">
        <Plus className="h-3.5 w-3.5" />
        Add First Queue
      </Button>
    </div>
  );
}

export function QueuePanel({ onAddQueue }: QueuePanelProps) {
  const {orgId} = useParams()
  const { selectedId } = useQueueGroupStore();

  const { queueGroups, isLoadingQueueGroups } = useQueueGroup({orgId});

  // Only execute query if we have a selected group ID
  const { queues, isLoadingQueues, queueError } = useQueue({ groupId: selectedId! });
  const selectedGroup = queueGroups?.data.find((item) => item.id === selectedId);

  // If a user hasn't active-clicked a side group yet, show the default unselected visual panel
  if (!selectedId && !isLoadingQueueGroups) return <NoGroupSelected />;
  if (!selectedGroup && !isLoadingQueueGroups) return <NoGroupSelected />;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
            <Layers className="text-muted-foreground h-4 w-4" />
          </div>
          <div>
            {isLoadingQueueGroups || isLoadingQueues ? (
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" /> {/* Group Title Skeleton */}
                <Skeleton className="h-3 w-40" /> {/* Subtitle Stats Skeleton */}
              </div>
            ) : (
              <>
                <h2 className="text-sm font-semibold">{selectedGroup?.name}</h2>
                <p className="text-muted-foreground text-xs">
                  {selectedGroup?.queueCount} queue{selectedGroup?.queueCount !== 1 ? "s" : ""} ·{" "}
                  {selectedGroup?.queueAgentsCount} agents
                </p>
              </>
            )}
          </div>
        </div>

        <Button
          size="sm"
          onClick={onAddQueue}
          className="h-8 gap-1.5 text-xs"
          disabled={isLoadingQueues}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Queue
        </Button>
      </div>

      {/* Content */}
      <QueryBoundary error={queueError}>
        <div className="flex-1 overflow-auto">
          {queues?.data.length === 0 ? (
            <QueueEmptyState onAddQueue={onAddQueue} />
          ) : (
            <QueueTable
              group={selectedGroup!}
              queues={queues?.data || []}
              isLoadingQueues={isLoadingQueues}
            />
          )}
        </div>
      </QueryBoundary>
    </div>
  );
}
