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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueue } from "@/features/queue/hooks";


interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  memberId: string[];
}

const AssignQueueDialog = ({ open, onOpenChange, memberId }: Props) => {
  const { queues } = useQueue();
  console.log(memberId);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Assign queue</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign queue</DialogTitle>
          <DialogDescription>Assign this member to one or more queues.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label>Queue</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select queue" />
            </SelectTrigger>
            <SelectContent>
              {queues?.data.map((queue) => (
                <SelectItem key={queue.id} value={queue.id}>
                  {queue.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button">Assign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignQueueDialog;
