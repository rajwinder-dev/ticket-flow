import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ticketPriority, type TicketPriority, type TicketSchemaResponse } from "@repo/schemas";
import { useTicket } from "../hooks";
interface props {
  ticket: TicketSchemaResponse;
}
export const TicketPriorityCell = ({ ticket }: props) => {
  const { updateTicketPriority, isUpdatingTicketPriority } = useTicket();

  return (
    <Select

      value={ticket.priority}
      onValueChange={(status: TicketPriority) =>
        updateTicketPriority({ id: ticket.id, data: { priority: status } })
      }
      disabled={isUpdatingTicketPriority}

    >
      <SelectTrigger className="w-[130px]" size="sm" >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ticketPriority.map((p) => (
          <SelectItem key={p} value={p}>
            {p.charAt(0) + p.slice(1).toLowerCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
