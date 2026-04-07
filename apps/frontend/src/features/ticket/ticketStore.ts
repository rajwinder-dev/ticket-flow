import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'

import type { Employee, Ticket, TicketPriority, TicketStatus } from "./ticket.types";

export const EMPLOYEES: Employee[] = [
  { id: "e1", name: "Arun Mehta", initials: "AM", avatarColor: "bg-blue-100 text-blue-800" },
  { id: "e2", name: "Priya Sharma", initials: "PS", avatarColor: "bg-purple-100 text-purple-800" },
  { id: "e3", name: "Rajan Kumar", initials: "RK", avatarColor: "bg-teal-100 text-teal-800" },
  { id: "e4", name: "Neha Reddy", initials: "NR", avatarColor: "bg-orange-100 text-orange-800" },
  { id: "e5", name: "Dev Tiwari", initials: "DT", avatarColor: "bg-amber-100 text-amber-800" },
  { id: "e6", name: "Meena Pillai", initials: "MP", avatarColor: "bg-pink-100 text-pink-800" },
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: "TKT-2401",
    title: "Login fails on Safari 17 with OAuth redirect",
    description:
      "Multiple users reported that logging in via OAuth on Safari 17 results in a redirect loop. The issue appears to be related to SameSite cookie policy changes in WebKit. Reproducible consistently on macOS Ventura + Safari 17.",
    status: "open",
    priority: "critical",
    type: "bug",
    assigneeId: "e1",
    reportedBy: "Vikram S.",
    createdAt: "2025-04-05T10:00:00Z",
    updatedAt: "2025-04-07T08:00:00Z",
    tags: ["auth", "safari", "oauth"],
    comments: [
      {
        id: "c1",
        author: "Arun Mehta",
        authorInitials: "AM",
        avatarColor: "bg-blue-100 text-blue-800",
        text: "Reproduced locally. The issue is in the redirect_uri handling post-OAuth. Looking into SameSite=None fix.",
        createdAt: "2025-04-06T09:30:00Z",
      },
      {
        id: "c2",
        author: "Priya Sharma",
        authorInitials: "PS",
        avatarColor: "bg-purple-100 text-purple-800",
        text: "Also seeing this with Google OAuth. Might be a broader WebKit regression.",
        createdAt: "2025-04-07T07:00:00Z",
      },
    ],
  },
  {
    id: "TKT-2400",
    title: "Add dark mode support to dashboard",
    description:
      "Design team has finalized the dark mode spec. Need to implement CSS variable overrides and a toggle in the settings panel. All charts and third-party widgets must also support the theme.",
    status: "in progress",
    priority: "high",
    type: "feature",
    assigneeId: "e2",
    reportedBy: "Design Team",
    createdAt: "2025-04-04T08:00:00Z",
    updatedAt: "2025-04-07T06:00:00Z",
    tags: ["ui", "dark-mode", "design"],
    comments: [
      {
        id: "c3",
        author: "Priya Sharma",
        authorInitials: "PS",
        avatarColor: "bg-purple-100 text-purple-800",
        text: "CSS variables are done. Working on chart theming now.",
        createdAt: "2025-04-05T14:00:00Z",
      },
    ],
  },
  {
    id: "TKT-2399",
    title: "Pagination breaks when filter is applied",
    description:
      "When a user applies any filter on the tickets list, the pagination resets but the page count doesn't update until the next render cycle. Results in showing 'Page 3 of 2' edge cases.",
    status: "in progress",
    priority: "high",
    type: "bug",
    assigneeId: "e3",
    reportedBy: "QA Team",
    createdAt: "2025-04-03T11:00:00Z",
    updatedAt: "2025-04-06T16:00:00Z",
    tags: ["pagination", "filters", "ui"],
    comments: [],
  },
  {
    id: "TKT-2398",
    title: "Export to CSV missing timezone info",
    description:
      "When exporting reports to CSV, all timestamps are in UTC without any indication of timezone. Users in EU region are confused by the time discrepancy.",
    status: "open",
    priority: "medium",
    type: "bug",
    assigneeId: "e4",
    reportedBy: "Support Team",
    createdAt: "2025-04-02T09:00:00Z",
    updatedAt: "2025-04-05T10:00:00Z",
    tags: ["export", "csv", "i18n"],
    comments: [],
  },
  {
    id: "TKT-2397",
    title: "Update onboarding checklist copy",
    description:
      "Marketing requested updated copy for the onboarding checklist. New copy doc shared in Notion. Should match the new brand voice guidelines.",
    status: "resolved",
    priority: "low",
    type: "task",
    assigneeId: "e1",
    reportedBy: "Marketing",
    createdAt: "2025-04-01T10:00:00Z",
    updatedAt: "2025-04-04T15:00:00Z",
    tags: ["content", "onboarding"],
    comments: [],
  },
  {
    id: "TKT-2396",
    title: "API rate limit errors under load test",
    description:
      "Load testing at 500+ concurrent users triggers 429 errors from our own API gateway. The rate limiter config seems too aggressive for authenticated enterprise accounts.",
    status: "open",
    priority: "critical",
    type: "bug",
    assigneeId: "e2",
    reportedBy: "DevOps",
    createdAt: "2025-03-31T08:00:00Z",
    updatedAt: "2025-04-06T11:00:00Z",
    tags: ["api", "performance", "rate-limit"],
    comments: [],
  },
  {
    id: "TKT-2395",
    title: "Implement webhook retry logic",
    description:
      "Slack integration webhooks don't retry on failure. Need exponential backoff with max 3 retries and dead-letter queue for failed events.",
    status: "in progress",
    priority: "high",
    type: "feature",
    assigneeId: "e5",
    reportedBy: "Platform Team",
    createdAt: "2025-03-30T09:00:00Z",
    updatedAt: "2025-04-05T13:00:00Z",
    tags: ["webhooks", "slack", "reliability"],
    comments: [],
  },
  {
    id: "TKT-2394",
    title: "Fix misaligned buttons on mobile checkout",
    description:
      "On iOS 17 with Chrome, the checkout action buttons are misaligned due to a flexbox gap issue in the payment step. Confirmed on iPhone 14 Pro.",
    status: "resolved",
    priority: "medium",
    type: "bug",
    assigneeId: "e6",
    reportedBy: "Customer Support",
    createdAt: "2025-03-29T10:00:00Z",
    updatedAt: "2025-04-03T09:00:00Z",
    tags: ["mobile", "ios", "checkout"],
    comments: [],
  },
  {
    id: "TKT-2393",
    title: "Document REST API endpoints for v2",
    description:
      "All new v2 endpoints need OpenAPI 3.0 spec documentation. Include request/response examples, error codes, and authentication requirements.",
    status: "in progress",
    priority: "medium",
    type: "docs",
    assigneeId: "e3",
    reportedBy: "Dev Team",
    createdAt: "2025-03-28T08:00:00Z",
    updatedAt: "2025-04-04T12:00:00Z",
    tags: ["docs", "api", "v2"],
    comments: [],
  },
  {
    id: "TKT-2392",
    title: "Add two-factor authentication support",
    description:
      "Security requirement for enterprise tier. Support TOTP (Google Authenticator) and SMS-based 2FA. Add recovery code flow as fallback.",
    status: "open",
    priority: "high",
    type: "feature",
    assigneeId: null,
    reportedBy: "Security Team",
    createdAt: "2025-03-27T09:00:00Z",
    updatedAt: "2025-04-02T08:00:00Z",
    tags: ["security", "2fa", "enterprise"],
    comments: [],
  },
  {
    id: "TKT-2391",
    title: "Memory leak in WebSocket handler",
    description:
      "Profiler shows steady memory growth in the WebSocket connection handler. Connections aren't being cleaned up properly on disconnect. Causes OOM after ~48h of uptime.",
    status: "open",
    priority: "critical",
    type: "bug",
    assigneeId: "e5",
    reportedBy: "SRE Team",
    createdAt: "2025-03-26T11:00:00Z",
    updatedAt: "2025-04-01T16:00:00Z",
    tags: ["websocket", "memory", "backend"],
    comments: [],
  },
  {
    id: "TKT-2390",
    title: "Upgrade Node.js to v22 LTS",
    description:
      "Node 18 EOL is approaching. Upgrade to v22 LTS across all services. Update CI/CD pipelines, Docker base images, and Lambda runtimes.",
    status: "closed",
    priority: "low",
    type: "task",
    assigneeId: "e1",
    reportedBy: "DevOps",
    createdAt: "2025-03-25T09:00:00Z",
    updatedAt: "2025-03-30T12:00:00Z",
    tags: ["node", "upgrade", "devops"],
    comments: [],
  },
];

interface TicketStore {
  tickets: Ticket[];
  selectedIds: Set<string>;
  statusFilter: string;
  priorityFilter: string;
  searchQuery: string;
  editingTicket: Ticket | null;
  detailTicket: Ticket | null;
  bulkAssignOpen: boolean;
  currentPage: number;

  // Actions
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  setStatusFilter: (s: string) => void;
  setPriorityFilter: (p: string) => void;
  setSearchQuery: (q: string) => void;
  setEditingTicket: (t: Ticket | null) => void;
  setDetailTicket: (t: Ticket | null) => void;
  setBulkAssignOpen: (open: boolean) => void;
  setCurrentPage: (page: number) => void;

  updateTicketPriority: (id: string, priority: TicketPriority) => void;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  assignTicket: (id: string, employeeId: string | null) => void;
  bulkAssign: (employeeId: string) => void;
  saveEditTicket: (ticket: Ticket) => void;
  addComment: (ticketId: string, text: string, author: Employee) => void;
}

export const useTicketStore = create<TicketStore>()(
  immer((set) => ({
    tickets: INITIAL_TICKETS,
    selectedIds: new Set<string>(),
    statusFilter: "all",
    priorityFilter: "",
    searchQuery: "",
    editingTicket: null,
    detailTicket: null,
    bulkAssignOpen: false,
    currentPage: 1,

    toggleSelect: (id) =>
      set((state: { selectedIds: Iterable<unknown> | null | undefined }) => {
        const next = new Set(state.selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        state.selectedIds = next;
      }),

    selectAll: (ids) =>
      set((state: { selectedIds: Set<string> }) => {
        state.selectedIds = new Set(ids);
      }),

    clearSelection: (): void =>
      set((state: TicketStore) => {
        state.selectedIds = new Set();
      }),

    setStatusFilter: (s: string): void =>
      set((state: TicketStore) => {
        state.statusFilter = s;
        state.currentPage = 1;
      }),

    setPriorityFilter: (p) =>
      set((state) => {
        state.priorityFilter = p;
        state.currentPage = 1;
      }),

    setSearchQuery: (q) =>
      set((state) => {
        state.searchQuery = q;
        state.currentPage = 1;
      }),

    setEditingTicket: (t) =>
      set((state) => {
        state.editingTicket = t;
      }),

    setDetailTicket: (t) =>
      set((state) => {
        state.detailTicket = t;
      }),

    setBulkAssignOpen: (open) =>
      set((state) => {
        state.bulkAssignOpen = open;
      }),

    setCurrentPage: (page) =>
      set((state) => {
        state.currentPage = page;
      }),

    updateTicketPriority: (id, priority) =>
      set((state) => {
        const t = state.tickets.find((x) => x.id === id);
        if (t) {
          t.priority = priority;
          t.updatedAt = new Date().toISOString();
        }
      }),

    updateTicketStatus: (id, status) =>
      set((state) => {
        const t = state.tickets.find((x) => x.id === id);
        if (t) {
          t.status = status;
          t.updatedAt = new Date().toISOString();
        }
        if (state.detailTicket?.id === id)
          state.detailTicket = state.tickets.find((x) => x.id === id) ?? null;
      }),

    assignTicket: (id, employeeId) =>
      set((state) => {
        const t = state.tickets.find((x) => x.id === id);
        if (t) {
          t.assigneeId = employeeId;
          t.updatedAt = new Date().toISOString();
        }
        if (state.detailTicket?.id === id)
          state.detailTicket = state.tickets.find((x) => x.id === id) ?? null;
      }),

    bulkAssign: (employeeId) =>
      set((state) => {
        const now = new Date().toISOString();
        state.tickets.forEach((t) => {
          if (state.selectedIds.has(t.id)) {
            t.assigneeId = employeeId;
            t.updatedAt = now;
          }
        });
        state.selectedIds = new Set();
        state.bulkAssignOpen = false;
      }),

    saveEditTicket: (ticket) =>
      set((state) => {
        const idx = state.tickets.findIndex((x) => x.id === ticket.id);
        if (idx !== -1) {
          state.tickets[idx] = { ...ticket, updatedAt: new Date().toISOString() };
        }
        state.editingTicket = null;
        if (state.detailTicket?.id === ticket.id) state.detailTicket = state.tickets[idx];
      }),

    addComment: (ticketId, text, author) =>
      set((state) => {
        const t = state.tickets.find((x) => x.id === ticketId);
        if (t) {
          t.comments.push({
            id: `c-${Date.now()}`,
            author: author.name,
            authorInitials: author.initials,
            avatarColor: author.avatarColor,
            text,
            createdAt: new Date().toISOString(),
          });
          t.updatedAt = new Date().toISOString();
        }
        if (state.detailTicket?.id === ticketId) {
          state.detailTicket = state.tickets.find((x) => x.id === ticketId) ?? null;
        }
      }),
  })),
);
