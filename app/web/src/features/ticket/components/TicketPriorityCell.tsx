import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type TicketPriority, type TicketSchemaResponse } from "@org/zod";
import { useTicket } from "../hooks";
import { ticketPriority } from "@repo/constants";
interface props {
  ticket: TicketSchemaResponse;
}
export const TicketPriorityCell = ({ ticket }: props) => {
  const { updateTicketPriority, isUpdatingTicketPriority } = useTicket();

  return (
    <Select
      value={ticket.priority}
      onValueChange={(status: TicketPriority) =>
        updateTicketPriority({ id: ticket.id, data: { priority: status, version: ticket.version } })
      }
      disabled={isUpdatingTicketPriority}
    >
      <SelectTrigger className="w-[130px]" size="sm">
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
