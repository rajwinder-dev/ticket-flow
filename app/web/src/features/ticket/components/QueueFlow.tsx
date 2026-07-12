import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function QueueFlow({ from, to }: { from?: string; to?: string }) {
  return (
    <div className="border-border bg-muted/40 flex items-center gap-2 rounded-lg border border-dashed px-4 py-3">
      <span className="bg-background text-foreground rounded-md border px-2.5 py-1 text-sm font-medium shadow-sm">
        {from}
      </span>
      <ArrowRight className="text-muted-foreground h-4 w-4 shrink-0" />
      <span
        className={cn(
          "rounded-md border px-2.5 py-1 text-sm font-medium",
          to
            ? "bg-secondary border-primary/20 text-foreground"
            : "bg-background text-muted-foreground border-dashed italic",
        )}
      >
        {to ?? "No queue Available in current group"}
      </span>
    </div>
  );
}
