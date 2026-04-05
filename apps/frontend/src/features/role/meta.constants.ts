import {
  BarChart2,
  FolderOpen,
  MessageSquare,
  Paperclip,
  Shield,
  Ticket,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface ModuleMeta {
  label: string;
  icon: LucideIcon;
  color: string;
}

export const MODULE_META: Record<string, ModuleMeta> = {
  ticket: { label: "Ticket", icon: Ticket, color: "text-blue-500" },
  comment: { label: "Comment", icon: MessageSquare, color: "text-green-500" },
  attachment: { label: "Attachment", icon: Paperclip, color: "text-yellow-500" },
  category: { label: "Category", icon: FolderOpen, color: "text-purple-500" },
  user: { label: "User", icon: Users, color: "text-rose-500" },
  report: { label: "Report", icon: BarChart2, color: "text-cyan-500" },
  other: { label: "Other", icon: Shield, color: "text-red-500" },
};
export const MODULES = Object.keys(MODULE_META);
