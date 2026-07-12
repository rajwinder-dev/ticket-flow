import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AgentChip({ username }: { username: string }) {
  return (
    <div className="bg-muted/60 border-border/60 flex items-center gap-1.5 rounded-md border px-2 py-1">
      <Avatar className="h-4 w-4">
        <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-semibold">
          {username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="text-muted-foreground text-xs">{username}</span>
    </div>
  );
}
