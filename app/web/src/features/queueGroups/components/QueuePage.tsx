import { useState } from "react";
import { CreateQueueDialog } from "./CreateQueueDialog";
import { CreateGroupDialog } from "./groups/CreateQueueGroup";
import { GroupSidebar } from "./groups/GroupSidebar";
import { QueuePanel } from "./queue/QueuePanel";
import { QueuePageHeader } from "./QueuepageHeader";
import { useGroups } from "@org/core";

export default function QueuePage() {
  const { selectedGroup } = useGroups();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateQueue, setShowCreateQueue] = useState(false);

  return (
    <div >
      <QueuePageHeader />
      <div className="bg-muted/40 flex overflow-hidden">
        <GroupSidebar onCreateGroup={() => setShowCreateGroup(true)} />
        <div className="bg-background flex min-w-0 flex-1 flex-col">
          <QueuePanel onAddQueue={() => setShowCreateQueue(true)} />
        </div>
        <CreateGroupDialog open={showCreateGroup} onClose={() => setShowCreateGroup(false)} />
        {selectedGroup && (
          <CreateQueueDialog open={showCreateQueue} onClose={() => setShowCreateQueue(false)} />
        )}
      </div>
    </div>
  );
}
