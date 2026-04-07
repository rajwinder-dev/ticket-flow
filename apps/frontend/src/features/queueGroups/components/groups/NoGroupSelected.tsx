import { Layers } from "lucide-react";

export function NoGroupSelected() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
        <Layers className="w-6 h-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold">Select a group</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[180px] leading-relaxed">
          Pick a support group on the left to view and manage its queues
        </p>
      </div>
    </div>
  );
}
