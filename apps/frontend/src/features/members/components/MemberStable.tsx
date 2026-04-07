import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { RowActions } from "./RowActions";
import { useMembersStore } from "../membersStore";
import { Avatar, RoleBadge, StatusBadge } from "./MemberBandges";

export function MembersTable() {
  // Select raw primitives — never call derived functions inside a selector
  // (they return new references every time, causing infinite re-render loops)
  const members = useMembersStore((s) => s.members);
  const search = useMembersStore((s) => s.search);
  const roleFilter = useMembersStore((s) => s.roleFilter);
  const statusFilter = useMembersStore((s) => s.statusFilter);
  const selected = useMembersStore((s) => s.selected);
  const toggleRow = useMembersStore((s) => s.toggleRow);
  const toggleAll = useMembersStore((s) => s.toggleAll);

  // Derive filtered rows locally — stable between renders unless inputs change
  const rows = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter((m) => {
      const matchSearch =
        !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
      const matchRole = roleFilter === "all" || m.role === roleFilter;
      const matchStatus = statusFilter === "all" || m.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [members, search, roleFilter, statusFilter]);

  const rowIds = rows.map((r) => r.id);
  const allChecked = rowIds.length > 0 && rowIds.every((id) => selected.has(id));
  const someChecked = rowIds.some((id) => selected.has(id)) && !allChecked;

  return (
    <div className="border-border overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10 pl-4">
              <Checkbox
                checked={allChecked}
                // indeterminate state via data attribute
                data-state={someChecked ? "indeterminate" : allChecked ? "checked" : "unchecked"}
                onCheckedChange={(v) => toggleAll(rowIds, !!v)}
                aria-label="Select all"
              />
            </TableHead>
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
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-muted-foreground py-10 text-center text-sm">
                No members match your filters.
              </TableCell>
            </TableRow>
          )}

          {rows.map((member, i) => {
            const isSelected = selected.has(member.id);
            return (
              <TableRow
                key={member.id}
                className={cn("group/row", isSelected && "bg-violet-50/60 dark:bg-violet-900/10")}
              >
                {/* Checkbox */}
                <TableCell className="pl-4">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleRow(member.id)}
                    aria-label={`Select ${member.name}`}
                  />
                </TableCell>

                {/* Member */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={member.name} index={i} />
                    <div>
                      <p className="text-sm leading-tight font-medium">{member.name}</p>
                      <p className="text-muted-foreground text-[11px]">{member.email}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell>
                  <RoleBadge role={member.role} />
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge status={member.status} />
                </TableCell>

                {/* Queues */}
                <TableCell>
                  {member.queues.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {member.queues.map((q) => (
                        <span
                          key={q}
                          className="border-border bg-muted/50 text-muted-foreground inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px]"
                        >
                          {q}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground/50 text-[11px]">—</span>
                  )}
                </TableCell>

                {/* Tasks */}
                <TableCell className="text-right text-sm font-medium">{member.tasks}</TableCell>

                {/* Joined */}
                <TableCell className="text-muted-foreground text-xs">{member.joined}</TableCell>

                {/* Row actions */}
                <TableCell className="pr-3">
                  <RowActions member={member} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
