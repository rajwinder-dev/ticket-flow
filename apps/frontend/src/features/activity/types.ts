import type { ActivityLogSchema } from "@repo/schemas";

export const severityConfig: Record<
  ActivityLogSchema["severity"],
  { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
> = {
  INFO: { variant: "secondary", label: "INFO" },
  WARN: { variant: "outline", label: "WARN" },
  ERROR: { variant: "destructive", label: "ERROR" },
  DEBUG: { variant: "default", label: "DEBUG" },
};
export function truncateId(id: string) {
  return `${id.slice(0, 8)}…`;
}
