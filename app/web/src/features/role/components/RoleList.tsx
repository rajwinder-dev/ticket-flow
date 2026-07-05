import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"; // Import shadcn skeleton
import useRole from "../hooks";
import { RoleCard } from "./RoleCard";
import { Card } from "@/components/ui/card";

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
          disabled={isLoadingRoles} // Prevent input interaction during loading state
        />
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
        {isLoadingRoles ? (
          // Renders a stack of structural skeletons matching the size/shape of your RoleCards
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="bg-card/50 space-y-2.5 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" /> {/* Role Name */}
                <Skeleton className="h-5 w-14 rounded-full" /> {/* Optional Badge/Status */}
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-11/12" /> {/* Description Line 1 */}
                <Skeleton className="h-3 w-3/4" /> {/* Description Line 2 */}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Skeleton className="h-3.5 w-16" /> {/* Permissions Count */}
                <Skeleton className="h-1.5 w-1.5 rounded-full" />
                <Skeleton className="h-3.5 w-20" /> {/* Agent Count */}
              </div>
            </Card>
          ))
        ) : roles?.data.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-xs">No roles found</p>
        ) : (
          roles?.data.map((role) => <RoleCard key={role.id} role={role} />)
        )}
      </div>
    </div>
  );
}
