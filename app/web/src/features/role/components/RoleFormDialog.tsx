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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { CreateRoleInput, RoleSchema } from "@org/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { PermissionEditor } from "./PermissionEditor";
import { totalPermCount, useRole } from "@org/core";

interface RoleFormDialogProps {
  trigger: React.ReactNode;
  initialRole?: RoleSchema;
  mode?: "create" | "edit";
}

export function RoleFormDialog({ trigger, initialRole, mode = "create" }: RoleFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { createRole, isCreatingRole, updateRole, isUpdatingRole } = useRole();

  const isPending = isCreatingRole || isUpdatingRole;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateRoleInput>({
    defaultValues: {
      name: initialRole?.name,
      description: initialRole?.description,
      permissions: initialRole?.permissions ?? {},
    },
  });

  const permissions = useWatch({ control, name: "permissions" });

  const onSubmit = (data: CreateRoleInput) => {
    const payload: CreateRoleInput = {
      name: data.name?.trim(),
      description: data.description,
      permissions: data.permissions,
    };

    if (mode === "create") {
      createRole(payload, {
        onSuccess: () => setOpen(false),
      });
    } else if (mode === "edit" && initialRole) {
      updateRole({ id: initialRole.id, data: payload }, { onSuccess: () => setOpen(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="flex max-h-[90vh] w-4xl max-w-4xl flex-col gap-0 p-0">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4">
          <DialogTitle className="text-xl">
            {mode === "create" ? "Create New Role" : `Edit Role — ${initialRole?.name}`}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Define a role name and select the permissions it should have."
              : "Update the role's details and its permission set."}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <form
          id="role-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 space-y-5 overflow-y-auto px-6 py-5"
        >
          {/* Name & description */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="role-name">
                Role Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="role-name"
                placeholder="e.g. Support Agent"
                disabled={isPending}
                {...register("name", {
                  required: "Role name is required.",
                  validate: (v) => !!v.trim() || "Role name cannot be blank.",
                })}
              />
              {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role-desc">Description</Label>
              <Input
                id="role-desc"
                placeholder="Short description (optional)"
                disabled={isPending}
                {...register("description")}
              />
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Permissions</Label>
              <span className="text-muted-foreground text-xs">
                {totalPermCount(permissions)} selected
              </span>
            </div>

            <Controller
              name="permissions"
              control={control}
              render={({ field }) => (
                <PermissionEditor permissionsData={field.value} onChange={field.onChange} />
              )}
            />
          </div>
        </form>

        <Separator />

        <DialogFooter className="shrink-0 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="role-form" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create"
              ? isCreatingRole
                ? "Creating…"
                : "Create Role"
              : isUpdatingRole
                ? "Saving…"
                : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
