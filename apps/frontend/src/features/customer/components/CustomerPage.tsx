import PageHeader from "@/components/PageHeader";
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
import { UserPlus } from "lucide-react";
import useCustomer from "../hooks";
import CreateCustomerFrom from "./CreateCustomerFrom";
import CustomerTable from "./CustomerTable";

const CustomerPage = () => {
  const { customers } = useCustomer();
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
              <CreateCustomerFrom />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </PageHeader>
      {/* <CustomerMatrices /> */}

      <div className="">
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between gap-4 space-y-2 p-4">
            <div>
              <h2>Customer list</h2>
              <CardDescription>Search by name, email, company, or customer ID.</CardDescription>
            </div>
            {/* <Input
              className="w-xs"
              placeholder="Search customersOld..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            /> */}
          </div>
          {customers?.data && <CustomerTable data={customers?.data} />}
        </div>
        {/* todo: later custome card */}
        {/* <div className="space-y-4 border-l p-4 px-8 lg:col-span-2">
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
        </div> */}
      </div>
    </div>
  );
};

export default CustomerPage;
