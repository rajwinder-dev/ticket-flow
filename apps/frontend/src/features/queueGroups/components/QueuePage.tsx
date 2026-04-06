import { useState } from "react";
import { useGroups } from "../hooks";
import { CreateQueueDialog } from "./CreateQueueDialog";
import { CreateGroupDialog } from "./CreateQueueGroup";
import { GroupSidebar } from "./GroupSidebar";
import { NoGroupSelected } from "./NoGroupSelected";
import { QueuePageHeader } from "./QueuepageHeader";
import { QueuePanel } from "./QueuePanel";

export default function QueuePage() {
  const { groups, selectedId, selectedGroup, setSelectedId, createQueue } = useGroups();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateQueue, setShowCreateQueue] = useState(false);

  return (
    <div className="">
      <QueuePageHeader />
      <div className="bg-muted/40 flex overflow-hidden">
        <GroupSidebar
          groups={groups}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onCreateGroup={() => setShowCreateGroup(true)}
        />
        <div className="bg-background flex min-w-0 flex-1 flex-col">
          {selectedGroup ? (
            <QueuePanel group={selectedGroup} onAddQueue={() => setShowCreateQueue(true)} />
          ) : (
            <NoGroupSelected />
          )}
        </div>
        <CreateGroupDialog open={showCreateGroup} onClose={() => setShowCreateGroup(false)} />
        {selectedGroup && (
          <CreateQueueDialog
            open={showCreateQueue}
            onClose={() => setShowCreateQueue(false)}
            onCreate={(name, desc) => createQueue(selectedGroup.id, name, desc)}
            groupName={selectedGroup.name}
          />
        )}
      </div>
    </div>
  );
}
