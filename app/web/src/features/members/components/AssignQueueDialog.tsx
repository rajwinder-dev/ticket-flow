import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMember, useQueue, useQueueGroup } from '@org/core';
import { useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  userId: string;
}

const AssignQueueDialog = ({ open, onOpenChange, userId }: Props) => {
  const { orgId } = useParams();
  const [groupId, setGroupId] = useState<string>();
  const [queueId, setQueueId] = useState<string>();
  const { queueGroups } = useQueueGroup({ orgId });
  const { queues } = useQueue({ groupId });
  const { assignQueueMutate, isAssigningQueue } = useMember({ orgId });
  const canSubmit = Boolean(queueId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Assign queue
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign queue</DialogTitle>
          <DialogDescription>
            Assign this member to one or more queues.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label>Group</Label>
          <Select onValueChange={setGroupId} value={groupId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select queue" />
            </SelectTrigger>
            <SelectContent>
              {queueGroups?.data.map((queue) => (
                <SelectItem key={queue.id} value={queue.id}>
                  {queue.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label>Queue</Label>
          <Select value={queueId} onValueChange={setQueueId}>
            <SelectTrigger className="w-full">
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
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isAssigningQueue}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!canSubmit}
            onClick={() =>
              assignQueueMutate(
                { queueId: queueId!, userId },
                {
                  onSuccess: () => {
                    onOpenChange(false);
                    toast.success('Queue assigned successfully');
                  },
                  onError: (error) => {
                    toast.error(error.message);
                  },
                },
              )
            }
          >
            {isAssigningQueue ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignQueueDialog;
