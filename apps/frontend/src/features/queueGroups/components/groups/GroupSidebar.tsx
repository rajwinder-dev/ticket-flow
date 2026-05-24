import QueryBoundary from "@/components/QueryError";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Import shadcn skeleton
import { Plus } from "lucide-react";
import { useQueueGroup } from "../../hooks";
import { GroupCard } from "./GroupCard";
import { Card } from "@/components/ui/card";

interface GroupSidebarProps {
  onCreateGroup: () => void;
}

export function GroupSidebar({ onCreateGroup }: GroupSidebarProps) {
  const { queueGroups, queueGroupError, isLoadingQueueGroups } = useQueueGroup();

  return (
    <aside className="bg-background flex h-[calc(100vh-151px)] w-80 shrink-0 flex-col border-r">
      {/* Header */}
      <div className="shrink-0 border-b px-4 pt-4.5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold tracking-tight">Support Groups</h1>
            {isLoadingQueueGroups ? (
              // Tiny text placeholder for the count text
              <Skeleton className="mt-1 h-3 w-20" />
            ) : (
              <p className="text-muted-foreground mt-0.5 text-xs">
                {queueGroups?.total || 0} groups total
              </p>
            )}
          </div>
          <Button size="sm" onClick={onCreateGroup} className="h-7 gap-1 text-xs">
            <Plus className="h-3 w-3" />
            New
          </Button>
        </div>
      </div>

      {/* Group list */}
      <QueryBoundary error={queueGroupError}>
        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {isLoadingQueueGroups ? (
            // Renders 4 stackable card templates to reflect the GroupCard structure
            Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="space-y-2.5 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28" /> {/* Group Name */}
                  <Skeleton className="h-4 w-8 rounded-md" /> {/* Optional count badge */}
                </div>
                <Skeleton className="h-3 w-full" /> {/* Description snippet line 1 */}
                <Skeleton className="h-3 w-2/3" /> {/* Description snippet line 2 */}
              </Card>
            ))
          ) : queueGroups?.data.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-xs">
              No support groups found.
            </p>
          ) : (
            queueGroups?.data.map((group) => <GroupCard key={group.id} group={group} />)
          )}
        </div>
      </QueryBoundary>
    </aside>
  );
}
