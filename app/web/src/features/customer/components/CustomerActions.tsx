import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CustomerSchemaResponse } from "@org/zod";
import { MoreHorizontal, Pencil } from "lucide-react";
import { useState } from "react";
import EditCustomerForm from "./EditCustomerForm";

interface props {
  data: CustomerSchemaResponse;
}

export function CustomerActionsMenu({ data }: props) {
  const [showEditForm, setShowEditForm] = useState(false);
  // const [showConfirmDelete, setShowConfirm] = useState(false);
  // const { deletedQueue, isDeletingQueue } = useQueue();
  // const handleQueueDelete = (id: string) => {
  //   deletedQueue(id, {
  //     onSuccess: () => setShowConfirm(true),
  //   });
  // };
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
              setShowEditForm(true);
            }}
          >
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Edit
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator /> */}
          {/* <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              // setShowConfirm(true);
            }}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite user to current organization</DialogTitle>
            <DialogDescription>
              Invite new members to your organization by entering their email address.
            </DialogDescription>
          </DialogHeader>
          <EditCustomerForm customer={data} onEdit={setShowEditForm} />
        </DialogContent>
      </Dialog>
      {/* <AlertDialog open={showConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you to want to delete customer</AlertDialogTitle>
            <AlertDialogDescription>
              deleting customer cause ticket
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={"destructive"}
              onClick={() => handleQueueDelete(data.id)}
              disabled={isDeletingQueue}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </>
  );
}
