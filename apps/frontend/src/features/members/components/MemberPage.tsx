import { BulkActionsBar } from "./BulkActionBar";
import { MemberMetrics } from "./MemberMetrics";
import { MembersTable } from "./MemberStable";
import { MemberToolbar } from "./MemberToolbar";

export default function MembersPage() {
  function handleInvite() {
    // Open your invite modal / sheet here
    alert("Open invite modal");
  }

  return (
    <div className="">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4 border-b px-6 py-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground text-sm">
            members of your organization, You can also invite new members and manage existing ones.
          </p>
        </div>
      </div>

      {/* Analytics strip */}
      <MemberMetrics />

      {/* Table card */}
      <div className="space-y-2">
        <MemberToolbar onInvite={handleInvite} />
        <BulkActionsBar />
        <MembersTable />
      </div>
    </div>
  );
}
