import { cn } from "@/lib/utils";

// ── Status badge ──────────────────────────────────────────────

// ── Avatar ────────────────────────────────────────────────────
const avatarColors = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100   text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100  text-amber-700",
  "bg-rose-100   text-rose-700",
  "bg-pink-100   text-pink-700",
];

export function Avatar({ name, index }: { name: string; index: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
        avatarColors[index % avatarColors.length],
      )}
    >
      {initials}
    </div>
  );
}
