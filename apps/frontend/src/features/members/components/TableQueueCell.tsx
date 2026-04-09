import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import useMember from "../hooks";
interface props {
  queue: {
    name: string | null;
    queueId: string | null;
  };
  userId: string;
}
const TableQueueCell = ({ queue, userId }: props) => {
  const [open, onOpenChange] = useState(false);
  const { unassignQueueMutate, isUnAssigningQueue } = useMember();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <span
        key={queue.name}
        className="border-border bg-muted/50 text-muted-foreground inline-flex h-6 items-center gap-1 rounded-md border px-1.5 text-[11px]"
      >
        <span className="truncate">{queue.name}</span>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon-xs" className="h-4 w-4 p-0">
            <X className="size-3" />
          </Button>
        </AlertDialogTrigger>
      </span>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unassign queue</AlertDialogTitle>
          <AlertDialogDescription>
            Remove this member from <span className="font-medium">{queue.name}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isUnAssigningQueue}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!queue.queueId || isUnAssigningQueue}
            onClick={() =>
              queue.queueId &&
              unassignQueueMutate(
                { queueId: queue.queueId, userId },
                { onSuccess: () => onOpenChange(false) },
              )
            }
          >
            {isUnAssigningQueue ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default TableQueueCell;
