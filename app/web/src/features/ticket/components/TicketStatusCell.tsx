import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type TicketSchemaResponse, type TicketStatus } from '@org/zod';
import { useTicket } from '@org/core';
import { allowedTransitions } from '@org/constants';
import { useParams } from 'react-router';
import { toast } from 'sonner';
interface props {
  ticket: TicketSchemaResponse;
}
export const TicketStatusCell = ({ ticket }: props) => {
  const { orgId } = useParams();
  const { updateTicketStatus, isUpdatingTicketStatus } = useTicket({ orgId });
  const nextStatus = allowedTransitions?.[ticket.status] || ['OPEN'];
  return (
    <Select
      value={ticket.status}
      onValueChange={(status: TicketStatus) =>
        updateTicketStatus(
          {
            id: ticket.id,
            data: { status: status, version: ticket.version },
          },
          {
            onSuccess: () => {
              toast.success('ticket updated successfully');
            },
            onError: (error) => {
              toast.error(error.message);
            },
          },
        )
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
