import { create } from "zustand";

export type Role = "admin" | "manager" | "member" | "viewer";
export type Status = "active" | "idle" | "offline";

export interface Member {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  queues: string[];
  joined: string;
  tasks: number;
}

interface MembersState {
  members: Member[];
  selected: Set<number>;
  search: string;
  roleFilter: string;
  statusFilter: string;

  // actions
  setSearch: (v: string) => void;
  setRoleFilter: (v: string) => void;
  setStatusFilter: (v: string) => void;
  toggleRow: (id: number) => void;
  toggleAll: (ids: number[], checked: boolean) => void;
  clearSelection: () => void;
  bulkRemove: () => void;
  bulkDeactivate: () => void;
  bulkChangeRole: (role: Role) => void;
  bulkAssignQueue: (queue: string) => void;
  removeMember: (id: number) => void;
  updateMember: (id: number, patch: Partial<Member>) => void;
  addMember: (member: Member) => void;
}

export const useMembersStore = create<MembersState>((set) => ({
  members: [
    {
      id: 1,
      name: "Anika Sharma",
      email: "anika@acme.io",
      role: "admin",
      status: "active",
      queues: ["Support", "Onboarding"],
      joined: "Jan 12, 2024",
      tasks: 14,
    },
    {
      id: 2,
      name: "Marcus Chen",
      email: "marcus@acme.io",
      role: "manager",
      status: "active",
      queues: ["Engineering", "Infra"],
      joined: "Mar 3, 2024",
      tasks: 9,
    },
    {
      id: 3,
      name: "Priya Nair",
      email: "priya@acme.io",
      role: "member",
      status: "idle",
      queues: ["Design"],
      joined: "Apr 22, 2024",
      tasks: 5,
    },
    {
      id: 4,
      name: "Tobias Müller",
      email: "tobias@acme.io",
      role: "member",
      status: "active",
      queues: ["Support"],
      joined: "Feb 1, 2024",
      tasks: 11,
    },
    {
      id: 5,
      name: "Layla Hassan",
      email: "layla@acme.io",
      role: "viewer",
      status: "offline",
      queues: [],
      joined: "May 9, 2024",
      tasks: 0,
    },
    {
      id: 6,
      name: "Ravi Patel",
      email: "ravi@acme.io",
      role: "member",
      status: "active",
      queues: ["Onboarding", "Growth"],
      joined: "Jun 14, 2024",
      tasks: 7,
    },
    {
      id: 7,
      name: "Sofia Eriksson",
      email: "sofia@acme.io",
      role: "manager",
      status: "idle",
      queues: ["Design", "Marketing"],
      joined: "Jul 20, 2024",
      tasks: 3,
    },
    {
      id: 8,
      name: "Jake O'Brien",
      email: "jake@acme.io",
      role: "member",
      status: "offline",
      queues: ["Support"],
      joined: "Aug 5, 2024",
      tasks: 0,
    },
  ],

  selected: new Set(),
  search: "",
  roleFilter: "all",
  statusFilter: "all",

  setSearch: (v) => set({ search: v, selected: new Set() }),
  setRoleFilter: (v) => set({ roleFilter: v, selected: new Set() }),
  setStatusFilter: (v) => set({ statusFilter: v, selected: new Set() }),

  toggleRow: (id) =>
    set((s) => {
      const next = new Set(s.selected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selected: next };
    }),

  toggleAll: (ids, checked) =>
    set((s) => {
      const next = new Set(s.selected);
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return { selected: next };
    }),

  clearSelection: () => set({ selected: new Set() }),

  bulkRemove: () =>
    set((s) => ({
      members: s.members.filter((m) => !s.selected.has(m.id)),
      selected: new Set(),
    })),

  bulkDeactivate: () =>
    set((s) => ({
      members: s.members.map((m) =>
        s.selected.has(m.id) ? { ...m, status: "offline" as Status } : m,
      ),
      selected: new Set(),
    })),

  bulkChangeRole: (role) =>
    set((s) => ({
      members: s.members.map((m) => (s.selected.has(m.id) ? { ...m, role } : m)),
      selected: new Set(),
    })),

  bulkAssignQueue: (queue) =>
    set((s) => ({
      members: s.members.map((m) =>
        s.selected.has(m.id) && !m.queues.includes(queue)
          ? { ...m, queues: [...m.queues, queue] }
          : m,
      ),
      selected: new Set(),
    })),

  removeMember: (id) =>
    set((s) => ({
      members: s.members.filter((m) => m.id !== id),
      selected: new Set([...s.selected].filter((x) => x !== id)),
    })),

  updateMember: (id, patch) =>
    set((s) => ({
      members: s.members.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    })),

  addMember: (member) => set((s) => ({ members: [...s.members, member] })),
}));
