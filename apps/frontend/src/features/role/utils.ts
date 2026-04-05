import { PERMISSIONS, type PermissionModule } from "@repo/schemas";

export const totalPermCount = (perms: Record<string, string[]>): number =>
  Object.values(perms).reduce((acc, arr) => acc + arr.length, 0);

export const togglePermission = (
  permissions: Record<string, string[]>,
  module: PermissionModule,
  perm: string,
): Record<string, string[]> => {
  const current = permissions[module] ?? [];
  const next = current.includes(perm) ? current.filter((p) => p !== perm) : [...current, perm];
  return { ...permissions, [module]: next };
};

export const toggleModulePermissions = (
  permissions: Record<string, string[]>,
  module: PermissionModule,
): Record<string, string[]> => {
  const allPerms = [...PERMISSIONS[module]] as string[];
  const current = permissions[module] ?? [];
  const allChecked = allPerms.every((p) => current.includes(p));
  return { ...permissions, [module]: allChecked ? [] : allPerms };
};

export const isModuleFullyChecked = (
  permissions: Record<string, string[]>,
  module: PermissionModule,
): boolean => {
  const allPerms = PERMISSIONS[module] as readonly string[];
  return allPerms.every((p) => (permissions[module] ?? []).includes(p));
};

export const isModulePartiallyChecked = (
  permissions: Record<string, string[]>,
  module: PermissionModule,
): boolean => {
  const current = permissions[module] ?? [];
  const allPerms = PERMISSIONS[module] as readonly string[];
  return current.length > 0 && !allPerms.every((p) => current.includes(p));
};
