import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListPlus, PowerOff, Trash2, UserCog, X } from "lucide-react";
import { useMembersStore, type Role } from "../membersStore";

const ROLES: Role[] = ["admin", "manager", "member", "viewer"];
const QUEUES = ["Support", "Onboarding", "Engineering", "Design", "Growth", "Infra", "Marketing"];

export function BulkActionsBar() {
  const { selected, clearSelection, bulkRemove, bulkDeactivate, bulkChangeRole, bulkAssignQueue } =
    useMembersStore();

  const count = selected.size;
  if (count === 0) return null;

  return (
    <div className="border-border flex items-center gap-2 border px-4 py-2.5 text-sm">
      <span className="font-medium">{count} selected</span>
      <div className="bg-border mx-2 h-4 w-px" />

      {/* Change role */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
            <UserCog size={13} />
            Change role
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {ROLES.map((r) => (
            <DropdownMenuItem key={r} className="capitalize" onSelect={() => bulkChangeRole(r)}>
              {r}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Assign queue */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
            <ListPlus size={13} />
            Assign queue
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {QUEUES.map((q) => (
            <DropdownMenuItem key={q} onSelect={() => bulkAssignQueue(q)}>
              {q}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Deactivate */}
      <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={bulkDeactivate}>
        <PowerOff size={13} />
        Deactivate
      </Button>

      {/* Remove */}
      <Button
        variant="outline"
        size="sm"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 gap-1.5 text-xs"
        onClick={bulkRemove}
      >
        <Trash2 size={13} />
        Remove
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground ml-auto h-7 gap-1 text-xs"
        onClick={clearSelection}
      >
        <X size={13} />
        Clear
      </Button>
    </div>
  );
}
