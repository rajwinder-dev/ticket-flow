import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export function MemberToolbar() {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 p-2">
      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="text-muted-foreground absolute top-1/2 left-2.5 -translate-y-1/2"
        />
        <Input placeholder="Search members…" className="h-8 w-52 pl-8 text-sm" />
      </div>

      {/* Role filter */}
      <Select>
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
      <Select>
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
