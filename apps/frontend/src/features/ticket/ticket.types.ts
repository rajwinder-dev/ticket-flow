export type TicketStatus = "open" | "in progress" | "resolved" | "closed";
export type TicketPriority = "critical" | "high" | "medium" | "low";
export type TicketType = "bug" | "feature" | "task" | "docs";

export interface Employee {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
}

export interface Comment {
  id: string;
  author: string;
  authorInitials: string;
  avatarColor: string;
  text: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: TicketType;
  assigneeId: string | null;
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  tags: string[];
}
