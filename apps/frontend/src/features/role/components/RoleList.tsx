import { Input } from "@/components/ui/input";
import useRole from "../hooks";
import { RoleCard } from "./RoleCard";

export function RoleList() {
  const { roles, isLoadingRoles } = useRole();
  return (
    <div className="flex w-80 shrink-0 flex-col border-r">
      <div className="border-b px-4 py-3">
        <Input
          placeholder="Search roles…"
          // value={search}
          // onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 text-sm"
        />
      </div>
      {isLoadingRoles && <div>Loading...</div>}
      <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
        {roles?.data.length === 0 && (
          <p className="text-muted-foreground py-8 text-center text-xs">No roles found</p>
        )}
        {roles?.data.map((role) => (
          <RoleCard key={role.id} role={role} />
        ))}
      </div>
    </div>
  );
}
