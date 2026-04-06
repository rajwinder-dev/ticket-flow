import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GroupCard } from "./GroupCard";
import type { Group } from "../groups";
import { useQueueGroup } from "../hooks";

interface GroupSidebarProps {
  groups: Group[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreateGroup: () => void;
}

export function GroupSidebar({
  selectedId,
  onSelect,
  onCreateGroup,
}: GroupSidebarProps) {
  const {queueGroups} = useQueueGroup()
  return (
    <aside className="w-80 shrink-0 flex flex-col bg-background border-r h-[calc(100vh-151px)]">
      {/* Header */}
      <div className="px-4 pt-4.5 pb-3 border-b shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold tracking-tight">Support Groups</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{queueGroups?.total} groups total</p>
          </div>
          <Button size="sm" onClick={onCreateGroup} className="h-7 gap-1 text-xs">
            <Plus className="w-3 h-3" />
            New
          </Button>
        </div>
      </div>

      {/* Group list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {queueGroups?.data.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            selected={selectedId === group.id}
            onClick={() => onSelect(group.id)}
          />
        ))}
      </div>
    </aside>
  );
}
