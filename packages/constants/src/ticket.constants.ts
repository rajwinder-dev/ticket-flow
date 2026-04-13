export const ticketPriority = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export const ticketStatus = [
  "OPEN",
  "CLOSED",
  "IN_PROGRESS",
  "ON_HOLD",
  "RESOLVED",
  "REOPENED",
  "ESCALATED",
] as const;
export const ticketCategory = ["BUG", "FEATURE", "TASK", "DOCS"] as const;
export const allowedTransitions = {
  OPEN: ["IN_PROGRESS", "CLOSED"],
  ESCALATED: ["IN_PROGRESS", "CLOSED"],
  IN_PROGRESS: ["RESOLVED", "ON_HOLD"],
  ON_HOLD: ["IN_PROGRESS"],
  RESOLVED: ["CLOSED", "REOPENED"],
  REOPENED: ["IN_PROGRESS"],
  CLOSED: ["REOPENED"],
};

export const escalationReasons = [
  { value: "technical-complexity", label: "Technical Complexity" },
  { value: "customer-dissatisfaction", label: "Customer Dissatisfaction" },
  { value: "sla-breach", label: "SLA Breach Risk" },
  { value: "security-concern", label: "Security Concern" },
  { value: "billing-dispute", label: "Billing Dispute" },
  { value: "requires-approval", label: "Requires Management Approval" },
  { value: "repeat-issue", label: "Repeat / Recurring Issue" },
  { value: "other", label: "Other" },
] as const;
export const ticketActions = [
  "ASSIGNED",
  "ESCALATED",
  "STATUS_CHANGED",
  "PRIORITY_CHANGED",
  "NOTE_ADDED",
] as const;
export const escalationReasonValues = escalationReasons.map((item) => item.value);
