export declare const ticketPriority: readonly ["LOW", "MEDIUM", "HIGH", "URGENT"];
export declare const ticketStatus: readonly ["OPEN", "CLOSED", "IN_PROGRESS", "ON_HOLD", "RESOLVED", "REOPENED", "ESCALATED"];
export declare const ticketCategory: readonly ["BUG", "FEATURE", "TASK", "DOCS"];
export declare const allowedTransitions: {
    OPEN: string[];
    ESCALATED: string[];
    IN_PROGRESS: string[];
    ON_HOLD: string[];
    RESOLVED: string[];
    REOPENED: string[];
    CLOSED: string[];
};
export declare const escalationReasons: readonly [{
    readonly value: "technical-complexity";
    readonly label: "Technical Complexity";
}, {
    readonly value: "customer-dissatisfaction";
    readonly label: "Customer Dissatisfaction";
}, {
    readonly value: "sla-breach";
    readonly label: "SLA Breach Risk";
}, {
    readonly value: "security-concern";
    readonly label: "Security Concern";
}, {
    readonly value: "billing-dispute";
    readonly label: "Billing Dispute";
}, {
    readonly value: "requires-approval";
    readonly label: "Requires Management Approval";
}, {
    readonly value: "repeat-issue";
    readonly label: "Repeat / Recurring Issue";
}, {
    readonly value: "other";
    readonly label: "Other";
}];
export declare const ticketActions: readonly ["ASSIGNED", "ESCALATED", "STATUS_CHANGED", "PRIORITY_CHANGED", "NOTE_ADDED"];
export declare const escalationReasonValues: ("other" | "technical-complexity" | "customer-dissatisfaction" | "sla-breach" | "security-concern" | "billing-dispute" | "requires-approval" | "repeat-issue")[];
//# sourceMappingURL=ticket.constants.d.ts.map