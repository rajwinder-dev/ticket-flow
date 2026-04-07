import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AgentStatus = "online" | "away" | "offline";
type TicketPriority = "high" | "medium" | "low";
type TicketStatus = "open" | "pending" | "resolved";

interface Agent {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  status: AgentStatus;
  openTickets: number;
  resolvedToday: number;
  loadPercent: number;
}

interface Ticket {
  id: string;
  subject: string;
  customer: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string;
  createdAt: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const AGENTS: Agent[] = [
  {
    id: "1",
    name: "Rahul Kapoor",
    email: "r.kapoor@support.io",
    initials: "RK",
    avatarColor: "bg-orange-100 text-orange-700",
    status: "online",
    openTickets: 5,
    resolvedToday: 12,
    loadPercent: 62,
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "p.sharma@support.io",
    initials: "PS",
    avatarColor: "bg-blue-100 text-blue-700",
    status: "online",
    openTickets: 3,
    resolvedToday: 9,
    loadPercent: 37,
  },
  {
    id: "3",
    name: "Anjali Mehta",
    email: "a.mehta@support.io",
    initials: "AM",
    avatarColor: "bg-green-100 text-green-700",
    status: "away",
    openTickets: 2,
    resolvedToday: 7,
    loadPercent: 25,
  },
  {
    id: "4",
    name: "Vikram Gupta",
    email: "v.gupta@support.io",
    initials: "VG",
    avatarColor: "bg-violet-100 text-violet-700",
    status: "online",
    openTickets: 7,
    resolvedToday: 14,
    loadPercent: 87,
  },
  {
    id: "5",
    name: "Neha Patel",
    email: "n.patel@support.io",
    initials: "NP",
    avatarColor: "bg-amber-100 text-amber-700",
    status: "offline",
    openTickets: 0,
    resolvedToday: 6,
    loadPercent: 0,
  },
  {
    id: "6",
    name: "Sanjay Rao",
    email: "s.rao@support.io",
    initials: "SR",
    avatarColor: "bg-teal-100 text-teal-700",
    status: "online",
    openTickets: 4,
    resolvedToday: 11,
    loadPercent: 50,
  },
];

const TICKETS: Ticket[] = [
  {
    id: "T-1041",
    subject: "Cannot login to account",
    customer: "Amit Verma",
    priority: "high",
    status: "open",
    assignedTo: "Rahul Kapoor",
    createdAt: "2h ago",
  },
  {
    id: "T-1040",
    subject: "Payment not reflecting",
    customer: "Sneha Joshi",
    priority: "high",
    status: "open",
    assignedTo: "Vikram Gupta",
    createdAt: "3h ago",
  },
  {
    id: "T-1039",
    subject: "Export CSV not working",
    customer: "Rohan Das",
    priority: "medium",
    status: "pending",
    assignedTo: "Priya Sharma",
    createdAt: "5h ago",
  },
  {
    id: "T-1038",
    subject: "Wrong invoice amount",
    customer: "Divya Nair",
    priority: "medium",
    status: "open",
    assignedTo: "Rahul Kapoor",
    createdAt: "6h ago",
  },
  {
    id: "T-1037",
    subject: "Feature request: dark mode",
    customer: "Karan Singh",
    priority: "low",
    status: "open",
    assignedTo: "Anjali Mehta",
    createdAt: "8h ago",
  },
  {
    id: "T-1036",
    subject: "App crashing on iOS 17",
    customer: "Meera Iyer",
    priority: "high",
    status: "open",
    assignedTo: "Vikram Gupta",
    createdAt: "9h ago",
  },
  {
    id: "T-1035",
    subject: "Profile picture not saving",
    customer: "Arjun Bose",
    priority: "low",
    status: "pending",
    assignedTo: "Sanjay Rao",
    createdAt: "11h ago",
  },
  {
    id: "T-1034",
    subject: "Email notifications delayed",
    customer: "Pooja Reddy",
    priority: "medium",
    status: "open",
    assignedTo: "Sanjay Rao",
    createdAt: "13h ago",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusDot({ status }: { status: AgentStatus }) {
  const color = {
    online: "bg-green-500",
    away: "bg-amber-500",
    offline: "bg-gray-400",
  }[status];
  return <span className={`inline-block h-2 w-2 rounded-full ${color}`} />;
}

function LoadBar({ percent }: { percent: number }) {
  const color = percent >= 80 ? "bg-red-500" : percent >= 50 ? "bg-amber-500" : "bg-green-500";
  return (
    <div className="flex items-center gap-2">
      <div className="bg-muted h-1.5 w-16 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-muted-foreground font-mono text-[11px]">
        {percent > 0 ? `${percent}%` : "—"}
      </span>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const styles = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-slate-50 text-slate-600 border-slate-200",
  }[priority];
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium capitalize ${styles}`}
    >
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: TicketStatus }) {
  const styles = {
    open: "bg-blue-50 text-blue-700 border-blue-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    resolved: "bg-green-50 text-green-700 border-green-200",
  }[status];
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium capitalize ${styles}`}
    >
      {status}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const QueueDetailPage = () => {
  const [agentSearch, setAgentSearch] = useState("");
  const [ticketSearch, setTicketSearch] = useState("");

  const filteredAgents = AGENTS.filter(
    (a) =>
      a.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(agentSearch.toLowerCase()),
  );

  const filteredTickets = TICKETS.filter(
    (t) =>
      t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.customer.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(ticketSearch.toLowerCase()),
  );

  const activeAgents = AGENTS.filter((a) => a.status === "online").length;
  const openTickets = TICKETS.filter((t) => t.status === "open").length;
  const highPriority = TICKETS.filter((t) => t.priority === "high").length;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* ── Header ── */}
      <div className="bg-background flex shrink-0 items-start justify-between gap-4 border-b px-6 py-4">
        <div>
          <p className="text-muted-foreground font-mono text-xs">
            Queues / <span className="font-medium text-orange-600">Support Tier 1</span>
          </p>
          <h1 className="mt-0.5 text-xl font-semibold tracking-tight">Support Tier 1</h1>
          <p className="text-muted-foreground text-sm">
            General customer support · Created Jan 12, 2024
          </p>
        </div>
        <div className="mt-1 flex shrink-0 items-center gap-2">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid shrink-0 grid-cols-4 border-b">
        {[
          { label: "Total Tickets", value: TICKETS.length },
          { label: "Open", value: openTickets },
          { label: "High Priority", value: highPriority },
          { label: "Active Agents", value: activeAgents },
        ].map((stat, i) => (
          <div key={i} className={`flex items-center gap-2 p-4 ${i < 3 ? "border-r" : ""}`}>
            <p className="text-muted-foreground text-sm">{stat.label}:</p>
            <p className="font-semibold tracking-tight text-orange-600">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Two-column body ── */}
      <div className="flex flex-1 divide-x overflow-hidden">
        {/* ── LEFT: Tickets ── */}
        <div className="flex w-[58%] flex-col overflow-hidden">
          <div className="flex shrink-0 items-center justify-between border-b px-5 py-3">
            <div>
              <p className="text-sm font-semibold">Tickets</p>
              <p className="text-muted-foreground text-xs">
                {TICKETS.length} total · {openTickets} open
              </p>
            </div>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
              <Input
                placeholder="Search tickets…"
                className="h-8 w-44 pl-8 text-sm"
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-20 pl-5 font-mono text-[11px] tracking-wider uppercase">
                    ID
                  </TableHead>
                  <TableHead className="font-mono text-[11px] tracking-wider uppercase">
                    Subject
                  </TableHead>
                  <TableHead className="font-mono text-[11px] tracking-wider uppercase">
                    Priority
                  </TableHead>
                  <TableHead className="font-mono text-[11px] tracking-wider uppercase">
                    Status
                  </TableHead>
                  <TableHead className="pr-5 font-mono text-[11px] tracking-wider uppercase">
                    Age
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="cursor-pointer">
                    <TableCell className="text-muted-foreground pl-5 font-mono text-[11px]">
                      {ticket.id}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm leading-tight font-medium">{ticket.subject}</p>
                      <p className="text-muted-foreground font-mono text-[11px]">
                        {ticket.customer}
                      </p>
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={ticket.priority} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground pr-5 font-mono text-[11px]">
                      {ticket.createdAt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ── RIGHT: Agents ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 items-center justify-between border-b px-5 py-3">
            <div>
              <p className="text-sm font-semibold">Agents</p>
              <p className="text-muted-foreground text-xs">
                {AGENTS.length} assigned · {activeAgents} active
              </p>
            </div>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
              <Input
                placeholder="Search agents…"
                className="h-8 w-40 pl-8 text-sm"
                value={agentSearch}
                onChange={(e) => setAgentSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="pl-5 font-mono text-[11px] tracking-wider uppercase">
                    Agent
                  </TableHead>
                  <TableHead className="font-mono text-[11px] tracking-wider uppercase">
                    Status
                  </TableHead>
                  <TableHead className="font-mono text-[11px] tracking-wider uppercase">
                    Open
                  </TableHead>
                  <TableHead className="pr-5 font-mono text-[11px] tracking-wider uppercase">
                    Load
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id} className="cursor-pointer">
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback
                            className={`text-[10px] font-semibold ${agent.avatarColor}`}
                          >
                            {agent.initials}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm leading-tight font-medium">{agent.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <StatusDot status={agent.status} />
                        <span className="text-xs capitalize">{agent.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{agent.openTickets}</TableCell>
                    <TableCell className="pr-5">
                      <LoadBar percent={agent.loadPercent} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueDetailPage;
