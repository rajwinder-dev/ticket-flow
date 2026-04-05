import type { RoleSchema } from "@repo/schemas";
import { PermissionReadView } from "./PermissionView";
import { RoleList } from "./RoleList";
import { RolesPageHeader } from "./RolePageHeader";

interface RolesPageProps {
  initialRoles?: RoleSchema[];
}

export default function RolesPage({ initialRoles = [] }: RolesPageProps) {
  return (
    <div>
      <RolesPageHeader />
      <div className="flex h-[calc(100vh-145px)]">
        <RoleList />

        <div className="flex-1 overflow-y-auto p-6">
          <PermissionReadView />
        </div>
      </div>
    </div>
  );
}
