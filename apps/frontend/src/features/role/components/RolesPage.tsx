import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PermissionReadView } from "./PermissionView";
import { RoleFormDialog } from "./RoleFormDialog";
import { RoleList } from "./RoleList";

export default function RolesPage() {
  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Manage roles and define what each one can d"
      >
        <RoleFormDialog
          mode="create"
          trigger={
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              New Role
            </Button>
          }
        />
      </PageHeader>
      <div className="flex h-[calc(100vh-145px)]">
        <RoleList />

        <div className="flex-1 overflow-y-auto p-6">
          <PermissionReadView />
        </div>
      </div>
    </div>
  );
}
