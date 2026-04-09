import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ActivityLogSchema } from "@repo/schemas";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { DetailPanel } from "./DetailPanel";
import { formatDate } from "../utils";
import { severityConfig, truncateId } from "../types";

export function ActivityRow({ log }: { log: ActivityLogSchema }) {
  const [open, setOpen] = useState(false);
  const { date, time } = formatDate(log.createdAt);
  const { variant, label } = severityConfig[log.severity];

  return (
    <>
      <TableRow
        className="hover:bg-muted/40 cursor-pointer transition-colors"
        onClick={() => setOpen((p) => !p)}
      >
        <TableCell className="text-muted-foreground w-8">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </TableCell>

        <TableCell className="whitespace-nowrap">
          <p className="text-sm font-medium">{date}</p>
          <p className="text-muted-foreground text-xs">{time}</p>
        </TableCell>

        <TableCell>
          <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">{log.event}</code>
        </TableCell>

        <TableCell className="text-muted-foreground text-sm">{log.message}</TableCell>

        <TableCell>
          <Badge variant={variant} className="text-[11px]">
            {label}
          </Badge>
        </TableCell>

        <TableCell className="text-right">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-muted-foreground cursor-default font-mono text-xs">
                  {truncateId(log.id)}
                </span>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="font-mono text-xs">{log.id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
      </TableRow>

      {open && (
        <TableRow className="bg-muted/20 hover:bg-muted/20">
          <TableCell />
          <TableCell colSpan={5} className="pt-2 pb-4">
            <DetailPanel log={log} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
