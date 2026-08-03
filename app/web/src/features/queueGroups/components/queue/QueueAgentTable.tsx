import { Search } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

// Shadcn/UI & Components
import QueryBoundary from '@/components/QueryError';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQueue } from '@org/core';
import type { QueueMembersSchemaResponse } from '@org/zod';

type QueueAgentTableProps = {
  isLoading?: boolean; // Accept parent page cascade state parameter
};

export function QueueAgentTable({
  isLoading: isParentLoading,
}: QueueAgentTableProps) {
  const { queueId } = useParams();
  const [agentSearch, setAgentSearch] = useState('');

  const { queuesAgents, isLoadingQueuesAgents, queueAgentError } = useQueue({
    queueId,
    agents: true,
  });
  const { queueSummary } = useQueue({ queueId });

  // Unify loading metrics across both local query data and parent state triggers
  const isLoading = isParentLoading || isLoadingQueuesAgents;

  // Helper to get initials (e.g., "Alayna_Dare" -> "AD")
  const getInitials = (name: string) => {
    return name
      .split(/[_.\s]/)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b px-5 py-3">
        <div>
          <p className="text-sm font-semibold">Agents</p>
          {isLoading ? (
            <Skeleton className="mt-1 h-3.5 w-16" /> // Inline meta subtitle loading status placeholder
          ) : (
            <p className="text-muted-foreground text-xs">
              {queueSummary?.data.activeAgents ?? 0} active
            </p>
          )}
        </div>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <Input
            placeholder="Search agents…"
            className="h-8 w-40 pl-8 text-sm"
            value={agentSearch}
            onChange={(e) => setAgentSearch(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <QueryBoundary error={queueAgentError}>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-5 font-mono text-[11px] tracking-wider uppercase">
                  Agent
                </TableHead>
                <TableHead className="font-mono text-[11px] tracking-wider uppercase">
                  Role
                </TableHead>
                <TableHead className="font-mono text-[11px] tracking-wider uppercase">
                  Tickets
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Structural tabular skeleton array layout matching layout dimensions exactly
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index} className="hover:bg-transparent">
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-7 w-7 rounded-full" />{' '}
                        {/* Avatar circle placeholder */}
                        <div className="space-y-1.5">
                          <Skeleton className="h-3.5 w-28" />{' '}
                          {/* Agent string identifier name line */}
                          <Skeleton className="h-2.5 w-36" />{' '}
                          {/* Secondary address communication string line */}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Skeleton className="h-2 w-2 rounded-full" />{' '}
                        {/* Static active circle placeholder */}
                        <Skeleton className="h-3.5 w-14" />{' '}
                        {/* Identity permissions indicator token */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-6 font-mono" />{' '}
                      {/* Numeric ticket tracking weight metrics placeholder */}
                    </TableCell>
                  </TableRow>
                ))
              ) : queuesAgents?.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-muted-foreground h-24 text-center"
                  >
                    No agents assigned to this queue.
                  </TableCell>
                </TableRow>
              ) : (
                queuesAgents?.data.map((member: QueueMembersSchemaResponse) => (
                  <TableRow
                    key={member.id}
                    className="hover:bg-muted/50 cursor-pointer"
                  >
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                            {member.name && getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm leading-tight font-medium">
                            {member.name}
                          </p>
                          <p className="text-muted-foreground text-[10px]">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            member.active
                              ? 'bg-green-500'
                              : 'bg-muted-foreground/40'
                          }`}
                        />
                        <span className="text-xs capitalize">
                          {member.role?.toLowerCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {member.ticketCount}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </QueryBoundary>
      </div>
    </div>
  );
}
