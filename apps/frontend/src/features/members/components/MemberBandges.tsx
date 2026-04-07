import { cn } from "@/lib/utils"
import type { Role, Status } from "../membersStore";


export function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium capitalize",
        "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
      )}
    >
      {role}
    </span>
  )
}

// ── Status badge ──────────────────────────────────────────────
const statusStyles: Record<Status, { dot: string; label: string }> = {
  active:  { dot: "bg-emerald-500", label: "bg-emerald-50  text-emerald-700  dark:bg-emerald-900/40 dark:text-emerald-400" },
  idle:    { dot: "bg-amber-400",   label: "bg-amber-50    text-amber-700    dark:bg-amber-900/40   dark:text-amber-400"   },
  offline: { dot: "bg-stone-400",   label: "bg-stone-100   text-stone-500    dark:bg-stone-800      dark:text-stone-400"   },
}

export function StatusBadge({ status }: { status: Status }) {
  const s = statusStyles[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium capitalize",
        s.label
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {status}
    </span>
  )
}

// ── Avatar ────────────────────────────────────────────────────
const avatarColors = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100   text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100  text-amber-700",
  "bg-rose-100   text-rose-700",
  "bg-pink-100   text-pink-700",
]

export function Avatar({ name, index }: { name: string; index: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
        avatarColors[index % avatarColors.length]
      )}
    >
      {initials}
    </div>
  )
}
