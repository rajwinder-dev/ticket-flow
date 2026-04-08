import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MemberSchemaResponse } from "@repo/schemas";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import AssignQueueDialog from "./AssignQueueDialog";
import EditRoleDialog from "./EditRoleDialog";

interface Props {
  member: MemberSchemaResponse;
}

export function RowActionsMenu({ member }: Props) {
  const [openEditRole, setOpenEditRole] = useState(false);
  const [openAssignQueue, setOpenAssignQueue] = useState(false);
  // const [openDisableMember, setOpenDisableMember] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Open member actions">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <EditRoleDialog
          open={openEditRole}
          onOpenChange={setOpenEditRole}
          memberId={[member.id]}
          currentRole={member?.roleId}
        />
        <AssignQueueDialog
          open={openAssignQueue}
          onOpenChange={setOpenAssignQueue}
          memberId={[member.id]}
        />
        {/* <DropdownMenuSeparator /> */}
        {/* <DisableMemberDialog
          open={openDisableMember}
          onOpenChange={setOpenDisableMember}
          memberId={[member.id]}
        /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
