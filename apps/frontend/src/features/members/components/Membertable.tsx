import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { MemberSchemaResponse } from "@repo/schemas";
import { useMembersStore } from "../store";
import { Avatar } from "./MemberBandges";
import { RowActionsMenu } from "./RowActionsMenu";

interface Props {
  memberData: MemberSchemaResponse[];
}

export function MembersTable({ memberData }: Props) {
  const { selected } = useMembersStore();

  return (
    <div className="border-border overflow-hidden rounded-md border">
      <Table>
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
          {memberData.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-muted-foreground py-10 text-center text-sm">
                No members match your filters.
              </TableCell>
            </TableRow>
          )}

          {memberData.map((member, i) => {
            const isSelected = selected.has(member.id);
            return (
              <TableRow
                key={member.id}
                className={cn("group/row", isSelected && "bg-violet-50/60 dark:bg-violet-900/10")}
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
                    <Avatar name={member.username ?? "User"} index={i} />
                    <div>
                      <p className="text-sm leading-tight font-medium">
                        {member.username ?? "Unknown User"}
                      </p>
                      <p className="text-muted-foreground text-[11px]">{member.email}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span
                    className={cn(
                      "bg-accent inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium capitalize",
                    )}
                  >
                    {member.role}
                  </span>
                </TableCell>

                <TableCell>
                  {/* Defaulting to "active" if status is null in your data */}
                  {/* <StatusBadge status={member.status ?? "active"} /> */}
                </TableCell>

                <TableCell>
                  {member.queues && member.queues.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {member.queues.map((q) => (
                        <span
                          key={q.name}
                          className="border-border bg-muted/50 text-muted-foreground inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px]"
                        >
                          {q.name}
                        </span>
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
    </div>
  );
}
