import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateTicketDialog } from "./CreateTicketDialog";

const TicketHeader = () => {
  const [openForm, setOpenForm] = useState(false);
  return (
    <div className="flex items-center justify-between gap-4 border-b px-6 py-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Ticket Management</h1>
        <p className="text-muted-foreground text-sm">
          View and filter ticket-related data in one place.
        </p>
      </div>
      <Button onClick={() => setOpenForm(true)}>
        <Plus /> Create Ticket
      </Button>
      <CreateTicketDialog
         openForm={openForm}
         setOpenForm={setOpenForm}
      />
    </div>
  );
};

export default TicketHeader;
