import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type TicketPriority } from '@org/zod';
import { useTicket } from '@org/core';
import { ticketPriority } from '@org/constants';
import { useParams } from 'react-router';
import { toast } from 'sonner';
interface props {
  ticket: {
    id: string;
    priority: TicketPriority;
    version: number;
  };
}
export const TicketPriorityCell = ({ ticket }: props) => {
  const { orgId, ticketId } = useParams();
  const { updateTicketPriority, isUpdatingTicketPriority } = useTicket({
    orgId,
    ticketId,
  });

  return (
    <Select
      value={ticket.priority}
      onValueChange={(status: TicketPriority) =>
        updateTicketPriority(
          {
            id: ticket.id,
            data: { priority: status, version: ticket.version },
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
