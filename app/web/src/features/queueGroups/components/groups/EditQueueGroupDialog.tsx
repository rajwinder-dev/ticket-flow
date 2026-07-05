import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you have a shadcn Checkbox
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateQueueGroupInput, QueueGroupSchemaResponse } from "@org/zod";
import { Controller, useForm } from "react-hook-form";
import { useQueueGroup } from "../../hooks";
import { useEffect } from "react";

interface Props {
  editOpen: boolean;
  setEditOpen: (editOpen: boolean) => void;
  groupData: QueueGroupSchemaResponse;
}

const EditQueueGroupDialog = ({ editOpen, setEditOpen, groupData }: Props) => {
  const { updateGroup, isUpdatingGroup } = useQueueGroup();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<CreateQueueGroupInput>({
  });

  useEffect(() => {
    reset({
      name: groupData.name,
      isDefault: groupData.default,
      description: groupData.description ?? "",
    })
  }, [groupData])
  const onSubmit = async (data: CreateQueueGroupInput) => {
    updateGroup(
      { id: groupData.id, data },
      {
        onSuccess: () => setEditOpen(false),
      },
    );
  };

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription>
            Update the name and description for this queue group.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Name Field */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              placeholder="Group name"
              {...register("name", { required: "Name is required" })}
            />
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Short description…"
              rows={3}
              {...register("description")}
            />
          </div>

          {/* Set as Default Checkbox */}
          <div className="flex items-center space-x-2 pt-2">
            <Controller
              name="isDefault"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="edit-default"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="edit-default"
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
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdatingGroup || !isDirty}>
              {isUpdatingGroup ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditQueueGroupDialog;
