import { Search } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

// Shadcn/UI Components (Adjust paths based on your project structure)
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Custom Hooks & Utils

import QueryBoundary from "@/components/QueryError";
import { useQueue } from "@/features/queue/hooks";
import { useTicket } from "@/features/ticket/hooks";
import { getAgeMetrics } from "@/lib/utils"; // Adjust this path to your helper file

export function QueueTicketTable() {
  const { queueId } = useParams();
  const [ticketSearch, setTicketSearch] = useState("");

  // Data Fetching
  const { ticketData, ticketDataError } = useTicket({
    filterOptions: {
      filter: {
        queueId: queueId!,
        // Note: You might need to add search logic to your hook here
        // search: ticketSearch
      },
    },
  });

  const { queueSummary } = useQueue({ queueId });

  // Optional: Client-side filtering if your hook doesn't handle search API-side

  return (
    <div className="flex w-[58%] flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b px-5 py-3">
        <div>
          <p className="text-sm font-semibold">Tickets</p>
          <p className="text-muted-foreground text-xs">
            {queueSummary?.data.totalTickets ?? 0} total · {queueSummary?.data.openTickets ?? 0}{" "}
            open
          </p>
        </div>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            placeholder="Search tickets…"
            className="h-8 w-44 pl-8 text-sm"
            value={ticketSearch}
            onChange={(e) => setTicketSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <QueryBoundary error={ticketDataError}>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-20 pl-5 font-mono text-[11px] tracking-wider uppercase">
                  ID
                </TableHead>
                <TableHead className="font-mono text-[11px] tracking-wider uppercase">
                  Subject
                </TableHead>
                <TableHead className="font-mono text-[11px] tracking-wider uppercase">
                  Priority
                </TableHead>
                <TableHead className="font-mono text-[11px] tracking-wider uppercase">
                  Status
                </TableHead>
                <TableHead className="pr-5 font-mono text-[11px] tracking-wider uppercase">
                  Age
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ticketData?.data.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-muted/50 cursor-pointer">
                  <TableCell className="text-muted-foreground pl-5 font-mono text-[11px]">
                    {ticket.code}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm leading-tight font-medium">{ticket.subject}</p>
                    <p className="text-muted-foreground font-mono text-[11px]">
                      {ticket.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{ticket.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{ticket.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground pr-5 font-mono text-[11px]">
                    {getAgeMetrics(ticket.createdAt, true)}
                  </TableCell>
                </TableRow>
              ))}
              {ticketData?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                    No tickets found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </QueryBoundary>
      </div>
    </div>
  );
}
