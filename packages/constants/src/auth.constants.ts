export const permissions = {
  ticket: [
    "create",
    "view_own",
    "view_all",
    "edit",
    "delete",
    "assign",
    "change_status",
    "change_priority",
    "escalate",
    "transition_history",
    "close",
    "reopen",
    "summary",
    "details"
  ],
  comment: ["create", "edit_own", "delete_own", "delete_any"],
  group: ["create", "edit", "delete", "view_all", "set_default"],
  queue: ["create", "edit", "delete", "view_all", "details", "summary"],
  activity: ["view"],
  customer: ["create", "edit", "view_all"],
  member: ["view_all", "change_role", "assign_queue", "unassign_queue"],
} as const;

export const modules = Object.keys(permissions) as Array<keyof typeof permissions>;
