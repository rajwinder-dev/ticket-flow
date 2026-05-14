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
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLookupHook } from "@/features/lookup/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import useMember from "../hooks";
import { useMembersStore } from "../store";
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
  // Use the data and loading state from your custom hook
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
  if (isLoadingMembers) return <Spinner />;

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-2 p-2">
        {/* Role filter */}
        <Select onValueChange={setRoleId}>
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All roles</SelectItem>
            {rolesData?.data.map((item) => (
              <SelectItem value={item.id}>{item.name}</SelectItem>
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
                {/*    <TableHead className="w-10 pl-4">
                  <Checkbox
                    // checked={allChecked}
                    // data-state={someChecked ? "indeterminate" : allChecked ? "checked" : "unchecked"}
                    onCheckedChange={(v) => toggle(rowIds, !!v)}
                    aria-label="Select all"
                  />
                </TableHead> */}
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
              {members?.data.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-muted-foreground py-10 text-center text-sm"
                  >
                    No members match your filters.
                  </TableCell>
                </TableRow>
              )}
              {members?.data.map((member, i) => {
                const isSelected = selected.has(member.id);
                return (
                  <TableRow
                    key={member.id}
                    className={cn(
                      "group/row",
                      isSelected && "bg-violet-50/60 dark:bg-violet-900/10",
                    )}
                  >
                    {/* <TableCell className="pl-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggle(member.id)}
                        aria-label={`Select ${member.username}`}
                      />
                    </TableCell> */}
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
                      {/* Defaulting to "active" if status is null in your data */}
                      {/* <StatusBadge status={member.status ?? "active"} /> */}
                    </TableCell>
                    <TableCell>
                      {member.queues && member.queues.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {member.queues.map((q) => (
                            <TableQueueCell queue={q} userId={member.userId} />
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
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      {members && (
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
