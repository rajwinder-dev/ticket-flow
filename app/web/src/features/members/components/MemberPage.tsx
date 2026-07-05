import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { MembersTable } from "./Membertable";
import { OrganizationInvite } from "./OrganizationInvite";
import { useState } from "react";

export default function MembersPage() {
  // const { selected } = useMembersStore();
  const [openInviteMember, setOpenInviteMember] = useState(false);
  return (
    <div className="flex flex-1 flex-col">
      {/* Page header */}
      <PageHeader
        title="Members"
        description="members of your organization, You can also invite new members and manage existing ones."
      >
        <Button
          size="sm"
          className="ml-auto h-8 gap-1.5 text-xs"
          onClick={() => setOpenInviteMember(true)}
        >
          <UserPlus size={13} />
          Invite member
        </Button>
        <Dialog onOpenChange={setOpenInviteMember} open={openInviteMember}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite user to current organization</DialogTitle>
              <DialogDescription>
                Invite new members to your organization by entering their email address.
              </DialogDescription>
            </DialogHeader>
            <OrganizationInvite onclose={() => setOpenInviteMember(false)} />
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
