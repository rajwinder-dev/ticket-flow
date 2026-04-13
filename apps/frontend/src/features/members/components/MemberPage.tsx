import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { MembersTable } from "./Membertable";
import { OrganizationInvite } from "./OrganizationInvite";

export default function MembersPage() {
  // const { selected } = useMembersStore();
  return (
    <div className="flex flex-col flex-1">
      {/* Page header */}
      <PageHeader
        title="Members"
        description="members of your organization, You can also invite new members and manage existing ones."
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="ml-auto h-8 gap-1.5 text-xs">
              <UserPlus size={13} />
              Invite member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite user to current organization</DialogTitle>
              <DialogDescription>
                Invite new members to your organization by entering their email address.
              </DialogDescription>
              <OrganizationInvite />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Analytics strip */}

      {/* Table card */}
        {<MembersTable />}
        {/* {selected.size > 0 && <BulkActionsBar />} */}
    </div>
  );
}
