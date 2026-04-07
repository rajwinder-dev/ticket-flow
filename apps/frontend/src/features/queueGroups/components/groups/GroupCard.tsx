import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { QueueGroupSchemaResponse } from "@repo/schemas";
import { ChevronRight, Pencil, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useQueueGroup } from "../../hooks";
import { useQueueGroupStore } from "../../store";
import EditQueueGroupDialog from "./EditQueueGroupDialog";

interface GroupCardProps {
  group: QueueGroupSchemaResponse;
}

export function GroupCard({ group }: GroupCardProps) {
  const { setGroupId, selectedId } = useQueueGroupStore();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { deleteGroup } = useQueueGroup();
  function handleDelete() {
    deleteGroup?.(group.id);
    setDeleteOpen(false);
  }
  const selected = group.id === selectedId;
  return (
    <>
      <button
        onClick={() => setGroupId(group.id)}
        className={`group relative w-full overflow-hidden rounded-xl border p-4 text-left transition-all duration-150 ${
          selected
            ? "dark:bg-muted border-transparent bg-white shadow-sm"
            : "bg-card border-border hover:shadow-sm"
        }`}
      >
        {/* Left accent bar */}
        <span
          className={`bg-primary absolute top-3 bottom-3 left-0 w-[3px] rounded-full transition-opacity duration-150 ${
            selected ? "opacity-100" : "opacity-30"
          }`}
        />

        <div className="pl-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              <Users className="text-card-foreground h-4 w-4" />
            </div>

            <div className="flex items-center gap-1">
              {/* Edit button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditOpen(true);
                }}
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1 opacity-0 transition-all duration-150 group-hover:opacity-100"
                aria-label="Edit group"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteOpen(true);
                }}
                className="hover:text-destructive hover:bg-destructive/10 text-muted-foreground rounded-md p-1 opacity-0 transition-all duration-150 group-hover:opacity-100"
                aria-label="Delete group"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              <ChevronRight
                className={`mt-0.5 h-3.5 w-3.5 shrink-0 transition-transform duration-150 ${
                  selected
                    ? "text-foreground rotate-90"
                    : "text-muted-foreground/30 group-hover:text-muted-foreground"
                }`}
              />
            </div>
          </div>

          <p className="mt-2.5 text-sm leading-snug font-semibold">{group.name}</p>
          <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">{group.description}</p>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-muted-foreground text-xs">
              <span className="text-foreground font-semibold">{group.queueCount}</span> queues
            </span>
            <span className="text-muted-foreground text-xs">·</span>
            <span className="text-muted-foreground text-xs">
              <span className="text-foreground font-semibold">{group.queueAgentsCount}</span> agents
            </span>
            {group.default && (
              <Badge className="ml-auto h-4 border px-1.5 text-[10px] font-semibold">Default</Badge>
            )}
          </div>
        </div>
      </button>

      {/* ── Edit Modal ── */}
      <EditQueueGroupDialog editOpen={editOpen} setEditOpen={setEditOpen} groupData={group} />
      {/* ── Delete Confirmation Modal ── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="text-foreground font-semibold">"{group.name}"</span>? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
