import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListPlus, MoreHorizontal, Pencil, PowerOff, Trash2 } from "lucide-react";

export function RowActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
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
        <DropdownMenuItem className="gap-2 text-xs">
          <PowerOff size={13} /> Deactivate
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:text-destructive gap-2 text-xs">
          <Trash2 size={13} /> Remove member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
