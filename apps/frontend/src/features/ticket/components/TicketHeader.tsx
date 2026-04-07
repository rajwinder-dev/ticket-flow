import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import TicketEditForm from "./TicketEditForm";

const TicketHeader = () => {
  return (
    <div className="flex items-center justify-between gap-4 border-b px-6 py-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Ticket Management</h1>
        <p className="text-muted-foreground text-sm">
          View and filter ticket-related data in one place.
        </p>
      </div>

      <Dialog>
        <DialogTrigger>
          <Button>
            <Plus /> Create Ticket
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Ticket</DialogTitle>
            <DialogDescription>Update ticket details and save changes.</DialogDescription>
          </DialogHeader>
          <TicketEditForm />
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketHeader;
