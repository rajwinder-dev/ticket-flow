export function QueueTag({ name }: { name: string }) {
  return (
    <span className="inline-block max-w-[120px] truncate bg-muted border-border/60 text-muted-foreground rounded border px-1.5 py-0.5 text-xs font-medium">
      {name}
    </span>
  );
}
