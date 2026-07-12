import { Badge } from "@/components/ui/badge";

export function ReasonBadge({ reason }: { reason: string }) {
  return (
    <Badge
      variant="outline"
      className="border-orange-200 text-xs text-orange-700 capitalize dark:border-orange-800 dark:text-orange-400"
    >
      {reason.replace(/-/g, " ")}
    </Badge>
  );
}
