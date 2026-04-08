import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  memberId: string[];
}

const DisableMemberDialog = ({ open, onOpenChange, memberId }: Props) => {
  console.log(memberId)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
          Disable member
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disable member</DialogTitle>
          <DialogDescription>
            This will disable the member account access for this organization.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" type="button">
            Disable
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisableMemberDialog;
