import { Pagination } from "@/components/Pagination";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton"; // Replaced global Spinner with layout Skeletons
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { useMember , useMembersStore, useLookupHook} from "@org/core";
import { Avatar } from "./MemberBandges";
import { RowActionsMenu } from "./RowActionsMenu";
import TableQueueCell from "./TableQueueCell";

export function MembersTable() {
  const { rolesData } = useLookupHook();
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 20,
  });
  const [roleId, setRoleId] = useState<string | undefined>();

  const { members, isLoadingMembers } = useMember({
    filterOptions: {
      offset: pagination.offset,
      limit: pagination.limit,
      filter: {
        ...(roleId && roleId !== "ALL" && { roleId }),
      },
    },
  });
  const { selected } = useMembersStore();

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-2 p-2">
        {/* Role filter */}
        <Select onValueChange={setRoleId} disabled={isLoadingMembers}>
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All roles</SelectItem>
            {rolesData?.data.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Invite */}
      </div>
      <div className="flex-1">
        <ScrollArea className="h-[calc(100vh-261px)]">
          <Table className="border-border border">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Queues assigned</TableHead>
                <TableHead className="text-right">Open tasks</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoadingMembers ? (
                // Clean layout skeleton row structures matching custom table row columns
                Array.from({ length: 3 }).map((_, idx) => (
                  <TableRow key={idx} className="hover:bg-transparent">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-3.5 w-24" />
                          <Skeleton className="h-3 w-36" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1.5">
                        <Skeleton className="h-5 w-16 rounded-md" />
                        <Skeleton className="h-5 w-12 rounded-md" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-4 w-6" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-3.5 w-16" />
                    </TableCell>
                    <TableCell className="pr-3">
                      <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              ) : members?.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-muted-foreground py-10 text-center text-sm"
                  >
                    No members match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                members?.data.map((member, i) => {
                  const isSelected = selected.has(member.id);
                  return (
                    <TableRow
                      key={member.id}
                      className={cn(
                        "group/row",
                        isSelected && "bg-violet-50/60 dark:bg-violet-900/10",
                      )}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar name={member.name ?? "User"} index={i} />
                          <div>
                            <p className="text-sm leading-tight font-medium">
                              {member.name ?? "Unknown User"}
                            </p>
                            <p className="text-muted-foreground text-[11px]">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge>{member.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {/* Status elements can mount layout tokens neatly here */}
                      </TableCell>
                      <TableCell>
                        {member.queues && member.queues.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {member.queues.map((q) => (
                              <TableQueueCell key={q.queueId} queue={q} userId={member.userId} />
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground/50 text-[11px]">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {member.totalTickets}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                        {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : ""}
                      </TableCell>
                      <TableCell className="pr-3">
                        <RowActionsMenu member={member} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      {members && !isLoadingMembers && (
        <Pagination
          limit={members?.limit}
          total={members?.total}
          offset={members?.offset}
          onChange={setPagination}
        />
      )}
    </>
  );
}
