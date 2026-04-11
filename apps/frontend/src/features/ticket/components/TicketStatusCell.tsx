import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {  type TicketSchemaResponse, type TicketStatus } from "@repo/schemas";
import { useTicket } from "../hooks";
import { allowedTransitions } from "@repo/constants";
interface props {
  ticket: TicketSchemaResponse;
}
export const TicketStatusCell = ({ ticket }: props) => {
  const { updateTicketStatus, isUpdatingTicketStatus } = useTicket();
  const nextStatus = allowedTransitions?.[ticket.status] || ["OPEN"];
  return (
    <Select
      value={ticket.status}
      onValueChange={(status: TicketStatus) =>
        updateTicketStatus({ id: ticket.id, data: { status: status } })
      }
      disabled={isUpdatingTicketStatus}
    >
      <SelectTrigger className="w-[130px]" size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ticket.status}>
          {}
          {ticket.status.charAt(0) + ticket.status.slice(1).toLowerCase()}
        </SelectItem>
        {nextStatus.map((p) => (
          <SelectItem key={p} value={p}>
            {p.charAt(0) + p.slice(1).toLowerCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
