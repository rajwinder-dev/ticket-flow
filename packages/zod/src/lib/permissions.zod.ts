import { permissions } from "@org/constants"

export type Permissions = Partial<typeof permissions>
export  type PermissionModule = keyof typeof permissions
export type PermissionAction<T extends PermissionModule>  = (typeof permissions)[T][number]




