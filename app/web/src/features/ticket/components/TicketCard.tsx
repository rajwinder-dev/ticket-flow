import { Link } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { TicketStatusCell } from './TicketStatusCell';
import { TicketPriorityCell } from './TicketPriorityCell';

import { formatDate } from '@/lib/utils';

interface TicketCardProps {
  ticket: any;
  handleOpenTicketForm: (ticket: any) => void;
  handleOpenEscalateForm: (ticket: any) => void;
}

export function TicketCard({
  ticket,
  handleOpenTicketForm,
  handleOpenEscalateForm,
}: TicketCardProps) {
  return (
    <Card className="w-full border-border " >
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="font-mono text-sm">{ticket.code}</CardTitle>

          <Link to={ticket.id} className="text-sm font-medium hover:underline">
            {ticket.subject}
          </Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              ...
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Ticket actions</DropdownMenuLabel>

            <DropdownMenuItem onClick={() => handleOpenTicketForm(ticket)}>
              Edit ticket
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleOpenEscalateForm(ticket)}>
              Escalate
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-destructive">
              Delete ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {ticket.description || 'No description'}
        </p>

        {/* Category */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="capitalize">
            {ticket.category}
          </Badge>
        </div>

        {/* Status / Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Status</p>
            <TicketStatusCell ticket={ticket} />
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Priority</p>
            <TicketPriorityCell ticket={ticket} />
          </div>
        </div>

        {/* Assignment */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground text-xs">Assigned To</p>

            <p className="text-sm font-medium">
              {ticket.assignedToUser?.name || 'Unassigned'}
            </p>

            <p className="text-muted-foreground text-xs">
              {ticket.queue?.name || 'No Queue'}
            </p>
          </div>

          {/* Updated */}
          <div>
            <p className="text-muted-foreground text-xs">Updated</p>

            <p className="text-sm">{formatDate(ticket.updatedAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
