import { Search } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

// Shadcn/UI & Components
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useMember from "@/features/members/hooks";
import { useQueue } from "@/features/queue/hooks";

// Mock/Helper components - replace with your actual imports


export function QueueAgentTable() {
  const { queueId } = useParams();
  const [agentSearch, setAgentSearch] = useState("");

  const { members } = useMember({
    filterOptions: { filter: { queueId: queueId || "" } },
  });
  const { queueSummary } = useQueue({ queueId });

  // Helper to get initials (e.g., "Alayna_Dare" -> "AD")
  const getInitials = (name: string) => {
    return name
      .split(/[_.\s]/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b px-5 py-3">
        <div>
          <p className="text-sm font-semibold">Agents</p>
          <p className="text-muted-foreground text-xs">
            {queueSummary?.data.activeAgents ?? 0} active
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
              <TableHead className="font-mono text-[11px] tracking-wider uppercase">Role</TableHead>
              <TableHead className="font-mono text-[11px] tracking-wider uppercase">Tickets</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members?.data.map((member) => (
              <TableRow key={member.id} className="hover:bg-muted/50 cursor-pointer">
                <TableCell className="pl-5">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                        {member.username && getInitials(member.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm leading-tight font-medium">{member.username}</p>
                      <p className="text-muted-foreground text-[10px]">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs capitalize">{member.role?.toLowerCase()}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{member.totalTickets}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
