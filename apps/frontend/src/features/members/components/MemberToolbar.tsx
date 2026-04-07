import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useMembersStore } from "../membersStore";

export function MemberToolbar() {
  const search = useMembersStore((s) => s.search);
  const roleFilter = useMembersStore((s) => s.roleFilter);
  const statusFilter = useMembersStore((s) => s.statusFilter);
  const setSearch = useMembersStore((s) => s.setSearch);
  const setRoleFilter = useMembersStore((s) => s.setRoleFilter);
  const setStatusFilter = useMembersStore((s) => s.setStatusFilter);

  return (
    <div className="flex flex-wrap items-center gap-2 p-2">
      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="text-muted-foreground absolute top-1/2 left-2.5 -translate-y-1/2"
        />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members…"
          className="h-8 w-52 pl-8 text-sm"
        />
      </div>

      {/* Role filter */}
      <Select value={roleFilter} onValueChange={setRoleFilter}>
        <SelectTrigger className="h-8 w-32 text-xs">
          <SelectValue placeholder="All roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="member">Member</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>

      {/* Status filter */}
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="h-8 w-32 text-xs">
          <SelectValue placeholder="All status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="idle">Idle</SelectItem>
          <SelectItem value="offline">Offline</SelectItem>
        </SelectContent>
      </Select>

      {/* Invite */}
    </div>
  );
}
