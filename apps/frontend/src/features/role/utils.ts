import { permissions } from "@repo/constants";
import {  type PermissionModule } from "@repo/schemas";

export const totalPermCount = (perms: Record<string, string[]>): number =>
  Object.values(perms).reduce((acc, arr) => acc + arr.length, 0);

export const togglePermission = (
  permissionsData: Record<string, string[]>,
  module: PermissionModule,
  perm: string,
): Record<string, string[]> => {
  const current = permissionsData[module] ?? [];
  const next = current.includes(perm) ? current.filter((p) => p !== perm) : [...current, perm];
  return { ...permissionsData, [module]: next };
};

export const toggleModulePermissions = (
  permissionsData: Record<string, string[]>,
  module: PermissionModule,
): Record<string, string[]> => {
  const allPerms = [...permissions[module]] as string[];
  const current = permissionsData[module] ?? [];
  const allChecked = allPerms.every((p) => current.includes(p));
  return { ...permissionsData, [module]: allChecked ? [] : allPerms };
};

export const isModuleFullyChecked = (
  permissionsData: Record<string, string[]>,
  module: PermissionModule,
): boolean => {
  const allPerms = permissions[module] as readonly string[];
  return allPerms.every((p) => (permissionsData[module] ?? []).includes(p));
};

export const isModulePartiallyChecked = (
  permissionsData: Record<string, string[]>,
  module: PermissionModule,
): boolean => {
  const current = permissionsData[module] ?? [];
  const allPerms = permissions[module] as readonly string[];
  return current.length > 0 && !allPerms.every((p) => current.includes(p));
};
