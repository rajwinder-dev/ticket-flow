import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { permissions } from "@repo/constants";
import { type PermissionModule } from "@org/zod";
import { Shield } from "lucide-react";
import { toggleModulePermissions, togglePermission } from "../utils";
import { memo } from "react";

interface PermissionEditorProps {
  permissionsData: Record<string, string[]>;
  onChange: (permissionsData: Record<string, string[]>) => void;
}

export const PermissionEditor = memo(({ permissionsData, onChange }: PermissionEditorProps)=>{
  return (
    <div className="space-y-3">
      {(Object.entries(permissions) as [PermissionModule, readonly string[]][]).map(
        ([module, perms]) => {
          const current = permissionsData[module] ?? [];
          return (
            <div key={module} className="bg-card overflow-hidden rounded-lg border">
              {/* Module header — click to toggle all */}
              <div
                className="bg-muted/40 hover:bg-muted/60 flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors select-none"
                onClick={() => onChange(toggleModulePermissions(permissionsData, module))}
              >
                <Shield className={`h-4 w-4 shrink-0`} />
                <span className="flex-1 text-sm font-semibold capitalize">{module}</span>
                <Badge variant="secondary" className="text-xs tabular-nums">
                  {current.length} / {perms.length}
                </Badge>
              </div>

              {/* Permission checklist grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 px-4 py-3 sm:grid-cols-3">
                {perms.map((perm) => (
                  <label key={perm} className="group flex cursor-pointer items-center gap-2">
                    <Checkbox
                      checked={current.includes(perm)}
                      onCheckedChange={() =>
                        onChange(togglePermission(permissionsData, module, perm))
                      }
                    />
                    <span className="text-muted-foreground group-hover:text-foreground text-xs capitalize transition-colors">
                      {perm.replace(/_/g, " ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        },
      )}
    </div>
  );
})
