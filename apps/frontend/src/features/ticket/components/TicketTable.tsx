import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";
import { EMPLOYEES, INITIAL_TICKETS } from "../ticketStore";
import TicketEditForm from "./TicketEditForm";

const TicketTable = () => {
  return (
    <div>
      {/* headers  */}
      <div className="flex items-center justify-between p-4">
        <div>
          <h2>Tickets</h2>
          <p>Search by ticket id, title, or assignee and narrow by filters.</p>
        </div>
        <div className="grid gap-2 md:w-auto md:grid-cols-3">
          <Input placeholder="Search tickets" className="md:w-64" />
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* table */}
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Ticket ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {INITIAL_TICKETS.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-muted-foreground py-8 text-center">
                No tickets found for current filters.
              </TableCell>
            </TableRow>
          ) : (
            INITIAL_TICKETS.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                <TableCell className="max-w-80 truncate hover:underline">
                  <Link to={ticket.id}>{ticket.title}</Link>
                </TableCell>
                <TableCell>
                  <Badge>{ticket.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge>{ticket.priority}</Badge>
                </TableCell>
                <TableCell>{ticket.assigneeId}</TableCell>
                <TableCell>{formatDate(ticket.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon-sm" aria-label="Open actions">
                        ...
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Ticket actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Dialog>
                          <DialogTrigger>Edit ticket</DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit ticket</DialogTitle>
                              <DialogDescription>
                                Update ticket details and save changes.
                              </DialogDescription>
                            </DialogHeader>
                            <TicketEditForm />
                            <DialogFooter>
                              <DialogClose>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button>Save changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuItem>

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Update status</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>Open</DropdownMenuItem>
                          <DropdownMenuItem>In progress</DropdownMenuItem>
                          <DropdownMenuItem>Resolved</DropdownMenuItem>
                          <DropdownMenuItem>Closed</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Assign ticket</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {EMPLOYEES.map((employee) => (
                            <DropdownMenuItem key={employee.id}>{employee.name}</DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Unassign</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">Delete ticket</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TicketTable;
