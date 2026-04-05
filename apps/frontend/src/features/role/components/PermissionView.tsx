import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PERMISSIONS } from "@repo/schemas";
import { Shield, ShieldCheck } from "lucide-react";
import { useSearchParams } from "react-router";
import useRole from "../hooks";
import { MODULE_META } from "../meta.constants";

export function PermissionReadView() {
  const { roles } = useRole();
  const [searchparams] = useSearchParams();
  const roleId = searchparams.get("roleId");
  const selectedRole = roles?.data.find(role => role.id === roleId)
  if (!selectedRole) {
    return (
      <div className="text-muted-foreground flex h-full flex-col items-center justify-center py-20 text-center">
        <ShieldCheck className="mb-3 h-12 w-12 opacity-20" />
        <p className="text-sm">Select a role to preview its permissions</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">{selectedRole.name}</h2>
        {selectedRole.description && <p className="text-muted-foreground text-sm">{selectedRole.description}</p>}
      </div>

      <Separator />

      <div className="space-y-3">
        {Object.entries(PERMISSIONS).map(([module, allPerms]) => {
          const meta = MODULE_META?.[module] || {};
          const Icon = meta?.icon || <Shield />;
          const granted = selectedRole.permissions[module] ?? [];

          return (
            <div key={module} className="overflow-hidden rounded-lg border">
              <div className="bg-muted/40 flex items-center gap-2.5 px-4 py-2.5">
                <Icon className={`h-4 w-4 ${meta.color}`} />
                <span className="text-sm font-semibold">{meta.label}</span>
                <Badge variant="secondary" className="ml-auto text-xs tabular-nums">
                  {granted.length} / {allPerms.length}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 px-4 py-3 sm:grid-cols-3">
                {(allPerms as readonly string[]).map((perm) => {
                  const has = granted.includes(perm);
                  return (
                    <div
                      key={perm}
                      className={`flex items-center gap-1.5 text-xs ${
                        has ? "text-foreground" : "text-muted-foreground/35"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          has ? "bg-green-500" : "bg-muted-foreground/25"
                        }`}
                      />
                      <span className="capitalize">{perm.replace(/_/g, " ")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
