import { Trash2, UserCog, ListPlus, PowerOff, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMembersStore, type Role } from "../membersStore"

const ROLES: Role[] = ["admin", "manager", "member", "viewer"]
const QUEUES = ["Support", "Onboarding", "Engineering", "Design", "Growth", "Infra", "Marketing"]

export function BulkActionsBar() {
  const selected        = useMembersStore((s) => s.selected)
  const clearSelection  = useMembersStore((s) => s.clearSelection)
  const bulkRemove      = useMembersStore((s) => s.bulkRemove)
  const bulkDeactivate  = useMembersStore((s) => s.bulkDeactivate)
  const bulkChangeRole  = useMembersStore((s) => s.bulkChangeRole)
  const bulkAssignQueue = useMembersStore((s) => s.bulkAssignQueue)

  const count = selected.size
  if (count === 0) return null

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-4 py-2.5 text-sm">
      <span className="font-medium">{count} selected</span>
      <div className="mx-2 h-4 w-px bg-border" />

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
      <Button
        variant="outline"
        size="sm"
        className="h-7 gap-1.5 text-xs"
        onClick={bulkDeactivate}
      >
        <PowerOff size={13} />
        Deactivate
      </Button>

      {/* Remove */}
      <Button
        variant="outline"
        size="sm"
        className="h-7 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={bulkRemove}
      >
        <Trash2 size={13} />
        Remove
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="ml-auto h-7 gap-1 text-xs text-muted-foreground"
        onClick={clearSelection}
      >
        <X size={13} />
        Clear
      </Button>
    </div>
  )
}
