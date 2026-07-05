import { Search } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

// Shadcn/UI Components
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"; // Import shadcn skeleton
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
import { useTicket } from "@org/core";
import { getAgeMetrics } from "@/lib/utils";
import { useQueue } from "@org/core";

type QueueTicketTableProps = {
  isLoading?: boolean; // Accept the loading control passed down from the parent shell
};

export function QueueTicketTable({ isLoading: isParentLoading }: QueueTicketTableProps) {
  const { queueId } = useParams();
  const [ticketSearch, setTicketSearch] = useState("");

  // Data Fetching
  const { ticketData, ticketDataError, isLoadingTicketData } = useTicket({
    filterOptions: {
      filter: {
        queueId: queueId!,
      },
    },
  });

  const { queueSummary } = useQueue({ queueId });

  // Consolidate loading states to prevent layout mismatching
  const isLoading = isParentLoading || isLoadingTicketData;

  return (
    <div className="flex w-[58%] flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b px-5 py-3">
        <div>
          <p className="text-sm font-semibold">Tickets</p>
          {isLoading ? (
            <Skeleton className="mt-1 h-3.5 w-32" /> // Sub-title summary metadata placeholder
          ) : (
            <p className="text-muted-foreground text-xs">
              {queueSummary?.data.totalTickets ?? 0} total · {queueSummary?.data.openTickets ?? 0}{" "}
              open
            </p>
          )}
        </div>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            placeholder="Search tickets…"
            className="h-8 w-44 pl-8 text-sm"
            value={ticketSearch}
            onChange={(e) => setTicketSearch(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <QueryBoundary error={ticketDataError}>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
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
              {isLoading ? (
                // Render structural skeleton rows matching the 5-column metrics layout exactly
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="hover:bg-transparent">
                    <TableCell className="w-20 pl-5">
                      <Skeleton className="h-3.5 w-10 font-mono" /> {/* Ticket Code Token */}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-48" /> {/* Main Subject text line */}
                        <Skeleton className="h-3 w-72" />{" "}
                        {/* Secondary description string text snippet */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-14 rounded-md" />{" "}
                      {/* Priority outline badge component */}
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-md" />{" "}
                      {/* Status filled badge component */}
                    </TableCell>
                    <TableCell className="pr-5">
                      <Skeleton className="h-3.5 w-12" />{" "}
                      {/* Chronological dynamic age string layout */}
                    </TableCell>
                  </TableRow>
                ))
              ) : ticketData?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                    No tickets found.
                  </TableCell>
                </TableRow>
              ) : (
                ticketData?.data.map((ticket) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </QueryBoundary>
      </div>
    </div>
  );
}
