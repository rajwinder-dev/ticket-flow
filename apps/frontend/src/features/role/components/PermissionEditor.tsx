import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PERMISSIONS, type PermissionModule } from "@repo/schemas";
import { MODULE_META } from "../meta.constants";
import {
  isModuleFullyChecked,
  isModulePartiallyChecked,
  toggleModulePermissions,
  togglePermission,
} from "../utils";

interface PermissionEditorProps {
  permissions: Record<string, string[]>;
  onChange: (permissions: Record<string, string[]>) => void;
}

export function PermissionEditor({ permissions, onChange }: PermissionEditorProps) {
  return (
    <div className="space-y-3">
      {(Object.entries(PERMISSIONS) as [PermissionModule, readonly string[]][]).map(
        ([module, perms]) => {
          const meta = MODULE_META[module];
          const Icon = meta.icon;
          const current = permissions[module] ?? [];
          const allChecked = isModuleFullyChecked(permissions, module);
          const someChecked = isModulePartiallyChecked(permissions, module);

          return (
            <div key={module} className="bg-card overflow-hidden rounded-lg border">
              {/* Module header — click to toggle all */}
              <div
                className="bg-muted/40 hover:bg-muted/60 flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors select-none"
                onClick={() => onChange(toggleModulePermissions(permissions, module))}
              >
                <Checkbox
                  checked={allChecked}
                  data-state={someChecked ? "indeterminate" : allChecked ? "checked" : "unchecked"}
                  onCheckedChange={() => onChange(toggleModulePermissions(permissions, module))}
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0"
                />
                <Icon className={`h-4 w-4 shrink-0 ${meta.color}`} />
                <span className="flex-1 text-sm font-semibold">{meta.label}</span>
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
                      onCheckedChange={() => onChange(togglePermission(permissions, module, perm))}
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
}
