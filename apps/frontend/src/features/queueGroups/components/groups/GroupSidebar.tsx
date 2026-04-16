import QueryBoundary from "@/components/QueryError";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQueueGroup } from "../../hooks";
import { GroupCard } from "./GroupCard";

interface GroupSidebarProps {
  onCreateGroup: () => void;
}

export function GroupSidebar({ onCreateGroup }: GroupSidebarProps) {
  const { queueGroups, queueGroupError } = useQueueGroup();
  return (
    <aside className="bg-background flex h-[calc(100vh-151px)] w-80 shrink-0 flex-col border-r">
      {/* Header */}
      <div className="shrink-0 border-b px-4 pt-4.5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold tracking-tight">Support Groups</h1>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {queueGroups?.total} groups total
            </p>
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
          {queueGroups?.data.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </QueryBoundary>
    </aside>
  );
}
