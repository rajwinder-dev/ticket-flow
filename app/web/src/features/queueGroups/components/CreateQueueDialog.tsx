import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueue, useQueueGroup, useQueueGroupStore } from '@org/core';
import { createQueueInput, type CreateQueueInput } from '@org/zod';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { toast } from 'sonner';

interface CreateQueueDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateQueueDialog({ open, onClose }: CreateQueueDialogProps) {
  const { selectedId } = useQueueGroupStore();
  const { orgId } = useParams();
  const { queueGroups } = useQueueGroup({ orgId });
  const selectedGroup = queueGroups?.data.find(
    (item) => item.id === selectedId,
  );
  const { createQueue, isCreatingQueue } = useQueue({ groupId: selectedId! });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateQueueInput>({
    resolver: zodResolver(createQueueInput.bodySchema),
  });

  function handleFormSubmit(data: CreateQueueInput) {
    if (!selectedId) return console.error('groupId not found ');
    createQueue(
      { groupId: selectedId, data },
      {
        onSuccess: () => {
          toast.success('queue created successfully');
          reset();
          onClose();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      reset();
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Queue — {selectedGroup?.name}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 py-1"
        >
          <div className="space-y-1.5">
            <label htmlFor="q-name" className="text-sm font-medium">
              Queue name
            </label>
            <input
              id="q-name"
              placeholder="e.g. Urgent Issues"
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="q-desc" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="q-desc"
              placeholder="What kind of tickets go here?"
              rows={2}
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full resize-none rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-destructive text-xs">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isCreatingQueue}>
              Add Queue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
