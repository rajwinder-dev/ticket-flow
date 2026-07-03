
export const GROUP_COLORS = [
  "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b",
  "#ef4444", "#06b6d4", "#ec4899", "#f97316",
];

export const INITIAL_GROUPS: Group[] = [
  {
    id: "g1",
    name: "Customer Support",
    description: "Front-line user support",
    memberCount: 12,
    color: "#3b82f6",
    queues: [
      { id: "q1", name: "General Inquiries", description: "General questions and info requests", ticketCount: 34, openCount: 12, createdAt: "Jan 10, 2025" },
      { id: "q2", name: "Urgent Issues", description: "Critical tickets needing immediate attention", ticketCount: 8, openCount: 5, createdAt: "Jan 12, 2025" },
      { id: "q3", name: "Billing & Payments", description: "Invoice, refunds, and subscription queries", ticketCount: 21, openCount: 7, createdAt: "Feb 3, 2025" },
    ],
  },
  {
    id: "g2",
    name: "Technical Ops",
    description: "Infrastructure & platform stability",
    memberCount: 8,
    color: "#8b5cf6",
    queues: [
      { id: "q4", name: "Infrastructure", description: "Server, network, and cloud incidents", ticketCount: 15, openCount: 4, createdAt: "Mar 1, 2025" },
      { id: "q5", name: "Security", description: "Vulnerability reports and security alerts", ticketCount: 6, openCount: 3, createdAt: "Mar 5, 2025" },
    ],
  },
  {
    id: "g3",
    name: "Onboarding",
    description: "New customer account setup",
    memberCount: 5,
    color: "#10b981",
    queues: [
      { id: "q6", name: "New Accounts", description: "Provisioning and initial configuration", ticketCount: 18, openCount: 9, createdAt: "Apr 2, 2025" },
    ],
  },
  {
    id: "g4",
    name: "Enterprise",
    description: "Dedicated enterprise client support",
    memberCount: 6,
    color: "#f59e0b",
    queues: [
      { id: "q7", name: "SLA Escalations", description: "Tickets breaching SLA thresholds", ticketCount: 5, openCount: 2, createdAt: "Apr 15, 2025" },
      { id: "q8", name: "Custom Integrations", description: "API and integration support requests", ticketCount: 11, openCount: 6, createdAt: "Apr 20, 2025" },
    ],
  },
];
export interface Queue {
  id: string;
  name: string;
  description: string;
  ticketCount: number;
  openCount: number;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  color: string;
  queues: Queue[];
}
