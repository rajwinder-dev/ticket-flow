import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueue } from "@/features/queue/hooks";
import type { QueueSchemaResponse } from "@repo/schemas";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface QueueActionsMenuProps {
  queue: QueueSchemaResponse;
  onEdit: (queue: QueueSchemaResponse) => void;
}

export function QueueActionsMenu({ queue, onEdit }: QueueActionsMenuProps) {
  const [showConfirmDelete, setShowConfirm] = useState(false);
  const { deletedQueue, isDeletingQueue } = useQueue();
  const handleQueueDelete = (id: string) => {
    deletedQueue(id, {
      onSuccess: () => setShowConfirm(true),
    });
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onEdit(queue);
            }}
          >
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you to want to delete queue</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete this queue
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={"destructive"}
              onClick={() => handleQueueDelete(queue.id)}
              disabled={isDeletingQueue}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
