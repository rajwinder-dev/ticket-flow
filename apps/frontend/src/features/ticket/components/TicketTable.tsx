import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TicketSchemaResponse } from "@repo/schemas";
import { useState } from "react";
import TicketEditDialog from "./TicketEditDialog";

import { Link } from "react-router-dom";
import { useTicket } from "../hooks";

// Assuming EMPLOYEES still comes from your store for the assignment list
import { Pagination } from "@/components/Pagination";
import { formatDate } from "@/features/activity/utils";
import { useDebounceValue } from "@/hooks/useDebounce";
import { ticketPriority, ticketStatus } from "@repo/constants";
import { TicketEscalateDialog } from "./TicketEscalateDialog";
import { TicketPriorityCell } from "./TicketPriorityCell";
import { TicketStatusCell } from "./TicketStatusCell";

const TicketTable = () => {
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [search, setSearch] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [priority, setPriority] = useState<string | undefined>();
  // Use the data and loading state from your custom hook
  const searchItem = useDebounceValue(search);
  const { ticketData, isLoadingTicketData } = useTicket({
    filterOptions: {
      offset: pagination.offset,
      limit: pagination.limit,
      filter: {
        ...(status && status !== "ALL" && { status }),
        ...(priority && priority !== "ALL" && { priority }),
      },
      search: {
        searchBy: "subject",
        search: searchItem,
      },
    },
  });
  const [editTicketForm, setEditTicketForm] = useState(false);
  const [escalateTicketForm, setEscalateTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketSchemaResponse | null>(null);
  function handlePagination(data: { offset: number; limit: number }) {
    setPagination({ offset: data.offset, limit: data.limit });
  }
  function handleOpenTicketForm(ticket: TicketSchemaResponse) {
    setEditTicketForm(true);
    setSelectedTicket(ticket);
  }
  function handleCloseTicketForm() {
    setEditTicketForm(false);
    setEscalateTicketForm(false);
    setSelectedTicket(null);
  }
  function handleOpenEscalateForm(ticket: TicketSchemaResponse) {
    setEscalateTicketForm(true);
    setSelectedTicket(ticket);
  }
  return (
    <div className="flex h-full flex-col">
      {/* Headers & Filters */}
      <div className="h-full">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-xl font-bold">Tickets</h2>
            <p className="text-muted-foreground text-sm">
              Search by ticket code, subject, or assignee.
            </p>
          </div>
          <div className="grid gap-2 md:w-auto md:grid-cols-3">
            <Input
              placeholder="Search tickets..."
              // className="md:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                {ticketStatus.map((item) => (
                  <SelectItem value={item} className="capitalize">
                    {item.split("_").join(" ").toLocaleLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setPriority}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All priorities</SelectItem>
                {ticketPriority.map((item) => (
                  <SelectItem value={item} className="capitalize">
                    {item.split("_").join(" ").toLocaleLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Code</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingTicketData ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center">
                  Loading tickets...
                </TableCell>
              </TableRow>
            ) : ticketData?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground py-8 text-center">
                  No tickets found for current filters.
                </TableCell>
              </TableRow>
            ) : (
              ticketData?.data.map((ticket) => (
                <TableRow key={ticket.id}>
                  {/* Using 'code' for display as it's usually the human-readable ID */}
                  <TableCell className="font-mono text-xs font-medium">{ticket.code}</TableCell>
                  <TableCell className="max-w-80 truncate font-medium hover:underline">
                    <Link to={ticket.id}>
                      {ticket.subject}
                      <p className="text-muted-foreground text-xs">{ticket.description}</p>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {ticket.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TicketStatusCell ticket={ticket} />
                  </TableCell>
                  <TableCell>
                    <TicketPriorityCell ticket={ticket} />
                  </TableCell>
                  <TableCell>
                    <p>{ticket.assignedToUser?.username || "Unassigned"}</p>
                    <p className="text-muted-foreground">{ticket.queue?.name || "Unassigned"}</p>
                  </TableCell>
                  <TableCell>{formatDate(ticket.updatedAt, true)}</TableCell>
                  <TableCell className="text-right">
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {selectedTicket && (
        <TicketEditDialog
          open={editTicketForm}
          setOpen={handleCloseTicketForm}
          ticket={selectedTicket}
        />
      )}
      {selectedTicket && (
        <TicketEscalateDialog
          open={escalateTicketForm}
          setOpen={handleCloseTicketForm}
          ticket={selectedTicket}
        />
      )}
      {ticketData && (
        <Pagination
          offset={ticketData?.offset}
          limit={ticketData?.limit}
          total={ticketData?.total}
          onChange={handlePagination}
        />
      )}
    </div>
  );
};

export default TicketTable;
