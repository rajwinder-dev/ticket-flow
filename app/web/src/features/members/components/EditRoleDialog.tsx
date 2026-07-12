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
import { useMember, useRole } from '@org/core';
import { useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  userId: string;
  currentRole?: string | null;
}

const EditRoleDialog = ({ open, onOpenChange, userId, currentRole }: Props) => {
  const { orgId } = useParams();
  const { updateRoleMutate, isUpdatingRole } = useMember({ orgId });
  const [roleId, setRoleId] = useState<string>(currentRole ?? '');
  const { roles } = useRole({ orgId });
  const canSubmit = Boolean(roleId) && !isUpdatingRole;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Change role
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>
          <DialogDescription>
            Update the member role for this organization.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={roleId} onValueChange={setRoleId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles?.data.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
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
            disabled={isUpdatingRole}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!canSubmit}
            onClick={() =>
              updateRoleMutate(
                { roleId, userId },
                {
                  onSuccess: () => {
                    onOpenChange(false);
                    toast.success('Role updated successfully');
                  },
                  onError: (error) => {
                    toast.error(error.message);
                  },
                },
              )
            }
          >
            {isUpdatingRole ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleDialog;
