import { Separator } from "@/components/ui/separator";
import type { ActivityLogSchema } from "@repo/schemas";
import { Building2, Clock, Globe, Info, Monitor, Shield, User } from "lucide-react";
import { formatDate } from "../utils";

export function DetailPanel({ log }: { log: ActivityLogSchema }) {
  const { date, time } = formatDate(log.createdAt);

  const fields = [
    { icon: <Clock className="h-3.5 w-3.5" />, label: "Timestamp", value: `${date} · ${time}` },
    { icon: <User className="h-3.5 w-3.5" />, label: "Actor", value: log.actorId, mono: true },
    { icon: <Shield className="h-3.5 w-3.5" />, label: "Actor Type", value: log.actorType },
    { icon: <Building2 className="h-3.5 w-3.5" />, label: "Entity Type", value: log.entityType },
    { icon: <Info className="h-3.5 w-3.5" />, label: "Entity ID", value: log.entityId, mono: true },
    {
      icon: <Building2 className="h-3.5 w-3.5" />,
      label: "Org ID",
      value: log.organizationId,
      mono: true,
    },
    { icon: <Globe className="h-3.5 w-3.5" />, label: "IP Address", value: log.ipAddress ?? "—" },
    { icon: <Monitor className="h-3.5 w-3.5" />, label: "User Agent", value: log.userAgent ?? "—" },
  ];

  return (
    <div className="space-y-4 pt-2">
      <div className="grid grid-cols-1 gap-2">
        {fields.map(({ icon, label, value, mono }) => (
          <div key={label} className="group flex items-start gap-2 text-sm">
            <span className="text-muted-foreground mt-0.5">{icon}</span>
            <span className="text-muted-foreground w-28 shrink-0">{label}</span>
            <span className={`flex-1 break-all ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
            {mono && value !== "—"}
          </div>
        ))}
      </div>

      {log.metadata && (
        <>
          <Separator />
          <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-widest uppercase">
            Metadata
          </p>
          <div className="bg-muted/50 space-y-1 rounded-md p-3 font-mono text-xs">
            {Object?.entries(log.metadata)?.map(([k, v]) => (
              <div key={k} className="group flex items-center gap-2">
                <span className="text-muted-foreground">{k}:</span>
                <span className="flex-1 break-all">{v}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
