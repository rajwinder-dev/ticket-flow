import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListPlus, PowerOff, Trash2, UserCog, X } from "lucide-react";
import { useMembersStore } from "@org/core";

const ROLES = ["admin", "manager", "member", "viewer"];
const QUEUES = ["Support", "Onboarding", "Engineering", "Design", "Growth", "Infra", "Marketing"];

export function BulkActionsBar() {
  const { selected } = useMembersStore();
  return (
    <div className="border-border bg-background sticky bottom-0 flex w-full items-center gap-2 border px-4 py-2.5 text-sm">
      <span className="font-medium">{selected.size} selected</span>
      <div className="bg-border mx-2 h-4 w-px" />
      <Button variant="ghost" size="sm" className="text-muted-foreground ml-auto h-7 gap-1 text-xs">
        <X size={13} />
        Clear
      </Button>
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
            <DropdownMenuItem key={r} className="capitalize">
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
            <DropdownMenuItem key={q}>{q}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Deactivate */}
      <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
        <PowerOff size={13} />
        Deactivate
      </Button>

      {/* Remove */}
      <Button
        variant="outline"
        size="sm"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 gap-1.5 text-xs"
      >
        <Trash2 size={13} />
        Remove
      </Button>
    </div>
  );
}
