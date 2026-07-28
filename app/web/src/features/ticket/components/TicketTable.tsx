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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton'; // Import shadcn skeleton
import { useState } from 'react';

import { Link, useParams } from 'react-router-dom';
import {
  useTicket,
  formatDate,
  useTicketStore,
  formatToDate,
  formatToTime,
} from '@org/core';

import { Pagination } from '@/components/Pagination';
import { useDebounceValue } from '@/hooks/useDebounce';
import { ticketPriority, ticketStatus } from '@org/constants';
import { TicketPriorityCell } from './TicketPriorityCell';
import { TicketStatusCell } from './TicketStatusCell';
import { useCustomParams } from '@/hooks/useCustomParams';
import { TicketCard } from './TicketCard';

const TicketTable = () => {
  const { orgId } = useParams();
  const { getParams } = useCustomParams();
  const { assignedTo } = getParams('assignedTo');
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });
  const [search, setSearch] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [priority, setPriority] = useState<string | undefined>();
  const searchItem = useDebounceValue(search);

  const { ticketData, isLoadingTicketData } = useTicket({
    filterOptions: {
      offset: pagination.offset,
      limit: pagination.limit,
      filter: {
        ...(status && status !== 'ALL' && { status }),
        ...(priority && priority !== 'ALL' && { priority }),
        ...(assignedTo ? { assignedTo } : {}),
      },
      sorting: { sortby: 'createdAt', sortOrder: 'desc' },
      search: {
        searchBy: 'subject',
        search: searchItem,
      },
    },
    orgId,
  });
  const { handleOpenTicketForm, handleOpenEscalateForm } = useTicketStore();
  function handlePagination(data: { offset: number; limit: number }) {
    setPagination({ offset: data.offset, limit: data.limit });
  }

  return (
    <div>
      {/* Headers & Filters */}
      <div className="h-full">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-xl font-bold capitalize">
              {assignedTo ? (assignedTo === 'none' ? 'unassigned' : 'My') : ''}{' '}
              Tickets
            </h2>
            <p className="text-muted-foreground text-sm">
              Search by ticket code, subject, or assignee.
            </p>
          </div>
          <div className="grid gap-2 lg:w-auto lg:grid-cols-3">
            <Input
              placeholder="Search tickets..."
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
                  <SelectItem key={item} value={item} className="capitalize">
                    {item.split('_').join(' ').toLocaleLowerCase()}
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
                  <SelectItem key={item} value={item} className="capitalize">
                    {item.split('_').join(' ').toLocaleLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Table className="hidden lg:table w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Code</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingTicketData ? (
              // Renders 5 placeholder rows that trace your actual columns perfectly
              Array.from({ length: 3 }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-transparent">
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell className="max-w-80">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-11/12" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : ticketData?.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-muted-foreground py-8 text-center"
                >
                  No tickets found for current filters.
                </TableCell>
              </TableRow>
            ) : (
              ticketData?.data.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono  text-xs font-medium">
                    {ticket.code}
                  </TableCell>
                  <TableCell className="min-w-30 truncate font-medium hover:underline">
                    <Link to={ticket.id}>
                      <p className="text-wrap">{ticket.subject}</p>

                      <p className="text-muted-foreground text-wrap  text-xs font-normal">
                        {ticket.description}
                      </p>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {ticket.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TicketStatusCell ticket={ticket} size="sm" />
                  </TableCell>
                  <TableCell>
                    <TicketPriorityCell ticket={ticket} size="sm" />
                  </TableCell>
                  <TableCell>
                    <p>{ticket.assignedToUser?.name || 'Unassigned'}</p>
                    <p className="text-muted-foreground text-xs">
                      {ticket.queue?.name || 'No Queue'}
                    </p>
                  </TableCell>
                  <TableCell className="flex flex-col">
                    <span>{formatToDate(ticket.updatedAt)}</span>
                    <span>{formatToTime(ticket.updatedAt)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          ...
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ticket actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleOpenTicketForm(ticket)}
                        >
                          Edit ticket
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenEscalateForm(ticket)}
                        >
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

        {/* Mobile Table */}
        <div className="flex flex-col p-4 lg:hidden gap-4">
          {ticketData?.data.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              handleOpenTicketForm={handleOpenTicketForm}
              handleOpenEscalateForm={handleOpenEscalateForm}
            />
          ))}
        </div>
      </div>
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
