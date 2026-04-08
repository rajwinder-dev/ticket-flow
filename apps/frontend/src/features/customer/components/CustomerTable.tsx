import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CustomerSchemaResponse } from "@repo/schemas";
import { CustomerActionsMenu } from "./CustomerActions";

interface Props {
  data: CustomerSchemaResponse[];
}

const CustomerTable = ({ data }: Props) => {
  return (
    <div className="border-t">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Total Tickets</TableHead>
            <TableHead className="text-right">Open</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={customer.avatarUrl ?? ""} alt={customer.name || ""} />
                    <AvatarFallback className="text-xs">
                      {customer.name
                        ? customer.name
                            .split(" ")
                            .map((part) => part[0])
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
          ))}

          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground h-24 text-center">
                No customers found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerTable;
