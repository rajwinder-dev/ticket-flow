import PageHeader from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDebounceValue } from "@/hooks/useDebounce";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import useCustomer from "../hooks";
import CreateCustomerFrom from "./CreateCustomerFrom";
import CustomerTable from "./CustomerTable";

const CustomerPage = () => {

  const [openCustomerForm, setOpenCustomerForm] = useState(false)
  const [search, setSearch] = useState<string | undefined>();
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
  });
  const searchItem = useDebounceValue(search);
  const { customers } = useCustomer({
    filterOptions: { search: { search: searchItem }, ...pagination },
  });
  return (
    <>
      <PageHeader
        title="Customer Management"
        description="MVP view focused on customer details, account health, and ticket
            context."
      >
        <Dialog open={openCustomerForm} onOpenChange={setOpenCustomerForm}>
            <Button size="sm" className="ml-auto h-8 gap-1.5 text-xs" onClick={() => setOpenCustomerForm(true)}>
              <UserPlus size={13} />
              Create Customer
            </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a customer </DialogTitle>
              <DialogDescription>
                Invite new members to your organization by entering their email address.
              </DialogDescription>
              <CreateCustomerFrom  setOpen={setOpenCustomerForm}/>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </PageHeader>
      {/* <CustomerMatrices /> */}

      <div className="flex items-center justify-between gap-4 space-y-2 p-4">
        <div>
          <h2>Customer list</h2>
          <CardDescription>Search by email.</CardDescription>
        </div>
        <Input
          className="w-xs"
          placeholder="Search customers by email."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <CustomerTable />
      {customers?.data && (
        <Pagination
          limit={customers.limit}
          total={customers.total}
          offset={customers.offset}
          onChange={setPagination}
        />
      )}
    </>
  );
};

export default CustomerPage;
