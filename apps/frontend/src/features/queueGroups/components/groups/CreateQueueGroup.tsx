import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createQueueGroupInput, type CreateQueueGroupInput } from "@repo/schemas";
import { useQueueGroup } from "../../hooks";

// Define the validation schema

interface CreateGroupDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateGroupDialog({ open, onClose }: CreateGroupDialogProps) {
  const { createGroup, isCreatingGroup } = useQueueGroup();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateQueueGroupInput>({
    resolver: zodResolver(createQueueGroupInput.bodySchema),
    defaultValues: {
      isDefault: false,
    },
  });

  // Reset form when the dialog closes or opens
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (data: CreateQueueGroupInput) => {
    createGroup(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Support Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-1">
          {/* Name Field */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Technical Support"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What does this group handle?"
              rows={2}
              {...register("description")}
            />
          </div>

          {/* Default Checkbox */}
          <div className="flex items-center space-x-2 pt-2">
            <Controller
              name="isDefault"
              control={control}
              render={({ field }) => (
                <Checkbox id="isDefault" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="isDefault"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Set as default group
              </Label>
              <p className="text-muted-foreground text-xs">
                New tickets will be assigned to this group by default.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isCreatingGroup}>
              {isCreatingGroup ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
