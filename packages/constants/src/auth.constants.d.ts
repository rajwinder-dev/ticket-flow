export declare const permissions: {
    readonly ticket: readonly ["create", "view_own", "view_all", "edit", "delete", "assign", "change_status", "change_priority", "escalate", "transition_history", "close", "reopen", "summary", "details"];
    readonly comment: readonly ["create", "edit_own", "delete_own", "delete_any"];
    readonly group: readonly ["create", "edit", "delete", "view_all", "set_default"];
    readonly queue: readonly ["create", "edit", "delete", "view_all", "details", "summary"];
    readonly activity: readonly ["view"];
    readonly customer: readonly ["create", "edit", "view_all"];
    readonly member: readonly ["view_all", "change_role", "assign_queue", "unassign_queue"];
};
export declare const modules: Array<keyof typeof permissions>;
//# sourceMappingURL=auth.constants.d.ts.map