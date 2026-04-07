import PageHeader from "@/components/PageHeader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import CustomerMatrices from "./CustomerMatrices";

type CustomerStatus = "active" | "at-risk" | "inactive";

type Customer = {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: "Free" | "Starter" | "Pro" | "Enterprise";
  status: CustomerStatus;
  openTickets: number;
  totalTickets: number;
  joinedOn: string;
  lastSeen: string;
  notes: string;
};

const customers: Customer[] = [
  {
    id: "CUST-1001",
    name: "Ava Brown",
    email: "ava@northstar.io",
    company: "NorthStar Labs",
    plan: "Pro",
    status: "active",
    openTickets: 2,
    totalTickets: 19,
    joinedOn: "2025-04-10",
    lastSeen: "2 hours ago",
    notes: "Power user. Prioritize billing and integration questions.",
  },
  {
    id: "CUST-1002",
    name: "Noah Patel",
    email: "noah@swiftcart.com",
    company: "SwiftCart",
    plan: "Starter",
    status: "at-risk",
    openTickets: 5,
    totalTickets: 12,
    joinedOn: "2025-08-22",
    lastSeen: "1 day ago",
    notes: "Waiting on migration support. Follow up this week.",
  },
  {
    id: "CUST-1003",
    name: "Mia Chen",
    email: "mia@pixelpeak.ai",
    company: "PixelPeak AI",
    plan: "Enterprise",
    status: "active",
    openTickets: 1,
    totalTickets: 42,
    joinedOn: "2024-11-03",
    lastSeen: "30 minutes ago",
    notes: "Executive account. SLA: first response within 1 hour.",
  },
  {
    id: "CUST-1004",
    name: "Liam Foster",
    email: "liam@opslane.dev",
    company: "OpsLane",
    plan: "Free",
    status: "inactive",
    openTickets: 0,
    totalTickets: 3,
    joinedOn: "2025-12-01",
    lastSeen: "3 weeks ago",
    notes: "No recent activity. Candidate for reactivation campaign.",
  },
];

const statusVariant: Record<CustomerStatus, "default" | "secondary" | "outline"> = {
  active: "default",
  "at-risk": "secondary",
  inactive: "outline",
};

const CustomerPage = () => {
  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id ?? "");

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;

    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.company.toLowerCase().includes(query) ||
        customer.id.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const selectedCustomer =
    filteredCustomers.find((customer) => customer.id === selectedCustomerId) ??
    filteredCustomers[0];

  return (
    <div>
      <PageHeader
        title="Customer Management"
        description="MVP view focused on customer details, account health, and ticket
            context."
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="ml-auto h-8 gap-1.5 text-xs">
              <UserPlus size={13} />
              Create Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a customer </DialogTitle>
              <DialogDescription>
                Invite new members to your organization by entering their email address.
              </DialogDescription>
              CUSTOMER CREATE FORM
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </PageHeader>
      <CustomerMatrices />

      <div className="grid lg:grid-cols-5 h-[calc(100vh-204px)]">
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between gap-4 space-y-2 p-4">
            <div>
              <h2>Customer list</h2>
              <CardDescription>Search by name, email, company, or customer ID.</CardDescription>
            </div>
            <Input
              className="w-xs"
              placeholder="Search customers..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Open</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  data-state={customer.id === selectedCustomer?.id ? "selected" : undefined}
                  onClick={() => setSelectedCustomerId(customer.id)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback>
                          {customer.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-muted-foreground text-xs">{customer.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.plan}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[customer.status]}>{customer.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{customer.openTickets}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4 border-l p-4 px-8 lg:col-span-2">
          <div>
            <h2>Customer details</h2>
            <p className="text-muted-foreground text-xs">
              {selectedCustomer
                ? "Selected customer profile and support context."
                : "Select a customer from the table."}
            </p>
          </div>
          <div>
            {!selectedCustomer ? (
              <p className="text-muted-foreground text-sm">No customer found for your search.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarFallback>
                      {selectedCustomer.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedCustomer.name}</p>
                    <p className="text-muted-foreground text-sm">{selectedCustomer.company}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p className="text-muted-foreground">Customer ID</p>
                  <p className="text-right font-medium">{selectedCustomer.id}</p>
                  <p className="text-muted-foreground">Email</p>
                  <p className="text-right font-medium">{selectedCustomer.email}</p>
                  <p className="text-muted-foreground">Plan</p>
                  <p className="text-right font-medium">{selectedCustomer.plan}</p>
                  <p className="text-muted-foreground">Joined</p>
                  <p className="text-right font-medium">{selectedCustomer.joinedOn}</p>
                  <p className="text-muted-foreground">Last seen</p>
                  <p className="text-right font-medium">{selectedCustomer.lastSeen}</p>
                  <p className="text-muted-foreground">Total tickets</p>
                  <p className="text-right font-medium">{selectedCustomer.totalTickets}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-muted-foreground text-sm">{selectedCustomer.notes}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm">Create Ticket</Button>
                  <Button size="sm" variant="outline">
                    View History
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
