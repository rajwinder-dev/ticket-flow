import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RoleFormDialog } from "./RoleFormDialog";

export function RolesPageHeader() {
  return (
    <div className="flex items-center justify-between gap-4 border-b px-6 py-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Roles & Permissions</h1>
        <p className="text-muted-foreground text-sm">
          Manage roles and define what each one can do
        </p>
      </div>

      <RoleFormDialog
        mode="create"
        trigger={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Role
          </Button>
        }
      />
    </div>
  );
}
