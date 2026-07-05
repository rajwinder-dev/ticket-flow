import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueue } from "@org/core";
import { updateQueueInput, type QueueSchemaResponse, type UpdateQueueInput } from "@org/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface QueueFormModalProps {
  open: boolean;
  queue: QueueSchemaResponse | null;
  onClose: () => void;
}

export function QueueFormModal({ open, queue, onClose }: QueueFormModalProps) {
  const { updatedQueue, isUpdatingQueue } = useQueue();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateQueueInput>({
    resolver: zodResolver(updateQueueInput.bodySchema),
  });
   useEffect(()=> {
    reset({
      name: queue?.name,
      description: queue?.description || ''
    })
   }, [queue, reset])
  function handleFormSubmit(data: UpdateQueueInput) {
    if (!queue?.id) return toast.error("Queue Id not defined ");
    updatedQueue(
      { queueId: queue?.id, data },
      {
        onSuccess: () => {
          reset();
          onClose()
        },
      },
    );
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      onClose();
      reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Edit Queue</DialogTitle>
          <DialogDescription>
            Update the name and description for <strong>{queue?.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label htmlFor="queue-name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="queue-name"
              placeholder="Queue name"
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              {...register("name")}
            />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="queue-description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="queue-description"
              placeholder="Optional description…"
              rows={3}
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full resize-none rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-destructive text-xs">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdatingQueue}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
