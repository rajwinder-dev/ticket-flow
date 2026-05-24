import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton"; // Import shadcn skeleton
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomerActionsMenu } from "./CustomerActions";
import useCustomer from "../hooks";

const CustomerTable = () => {
  const { customers, isLoadingCustomers } = useCustomer();
  return (
    <div className="min-h-0 flex-1 overflow-auto border-t">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Total Tickets</TableHead>
            <TableHead className="text-right">Open</TableHead>
            <TableHead className="w-[48px]" />{" "}
            {/* Added column header to balance the actions cell alignment */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoadingCustomers ? (
            // Proportional layout skeletons matching columns explicitly
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))
          ) : customers?.data.length === 0 ? (
            <TableRow>
              {/* Bumped colSpan up to 5 to account for the newly fixed actions header */}
              <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                No customers found.
              </TableCell>
            </TableRow>
          ) : (
            customers?.data.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={customer.avatarUrl ?? ""} alt={customer.name || ""} />
                      <AvatarFallback className="text-xs">
                        {customer.name
                          ? customer.name
                              .split(" ")
                              .map((part: string) => part[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          : "???"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm leading-none font-medium">{customer.name}</span>
                      <span className="text-muted-foreground text-xs">{customer.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {customer.phone ?? <span className="text-muted-foreground/50">—</span>}
                </TableCell>
                <TableCell className="text-sm">{customer.totalTickets}</TableCell>
                <TableCell className="text-right font-medium">{customer.openTickets}</TableCell>
                <TableCell className="text-right font-medium">
                  <CustomerActionsMenu data={customer} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerTable;
