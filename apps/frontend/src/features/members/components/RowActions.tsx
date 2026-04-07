import { MoreHorizontal, Pencil, Trash2, PowerOff, ListPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMembersStore, type Member } from "../membersStore"

interface RowActionsProps {
  member: Member
}

export function RowActions({ member }: RowActionsProps) {
  const removeMember  = useMembersStore((s) => s.removeMember)
  const updateMember  = useMembersStore((s) => s.updateMember)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground opacity-0 group-hover/row:opacity-100"
        >
          <MoreHorizontal size={15} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem className="gap-2 text-xs">
          <Pencil size={13} /> Edit profile
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-xs">
          <ListPlus size={13} /> Assign to queue
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-xs"
          onSelect={() => updateMember(member.id, { status: "offline" })}
        >
          <PowerOff size={13} /> Deactivate
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 text-xs text-destructive focus:text-destructive"
          onSelect={() => removeMember(member.id)}
        >
          <Trash2 size={13} /> Remove member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
