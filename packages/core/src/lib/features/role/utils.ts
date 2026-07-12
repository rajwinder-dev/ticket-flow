import { permissions } from "@org/constants";
import { type PermissionModule } from "@org/zod";

export const totalPermCount = (perms: Record<string, string[]>): number => {
  return Object.values(perms).reduce((acc, arr) => acc + arr.length, 0);
};

export const togglePermission = (
  permissionsData: Record<string, string[]>,
  module: PermissionModule,
  perm: string,
) => {
  const current = permissionsData[module] ?? [];
  const next = current.includes(perm) ? current.filter((p) => p !== perm) : [...current, perm];
  return { ...permissionsData, [module]: next };
};

export const toggleModulePermissions = (
  permissionsData: Record<string, string[]>,
  module: PermissionModule,
) => {
  const allPerms = [...permissions[module]];
  const current = permissionsData[module] ?? [];
  const allChecked = allPerms.every((p) => current.includes(p));
  return { ...permissionsData, [module]: allChecked ? [] : allPerms };
};
