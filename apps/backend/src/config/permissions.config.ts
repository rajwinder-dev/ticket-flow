export const PERMISSIONS = {
  ticket: [
    "create",
    "view_own",
    "view_all",
    "edit",
    "delete",
    "assign",
    "change_status",
    "add_comment",
    "close",
    "reopen",
  ],
  comment: ["create", "edit_own", "delete_own", "delete_any"],
  attachment: ["upload", "delete"],
  category: ["create", "edit", "delete", "view"],
  user: ["view", "assign_ticket"],
  report: ["view", "export"],
} as const;
export  type PermissionModule = keyof typeof PERMISSIONS
export type PermissionAction<T extends PermissionModule>  = (typeof PERMISSIONS)[T][number]
