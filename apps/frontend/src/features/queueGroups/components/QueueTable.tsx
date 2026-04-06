import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { QueueSchemaResponse } from "@repo/schemas";
import {  Inbox, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Group } from "../groups";

interface QueueTableProps {
  group: Group;
  queues: QueueSchemaResponse[] | undefined;
}

export function QueueTable({ group, queues }: QueueTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[220px] pl-6 text-xs font-medium">Queue</TableHead>
          <TableHead className="text-xs font-medium">Description</TableHead>
          <TableHead className="w-[100px] text-right text-xs font-medium">Total Tickets</TableHead>
          <TableHead className="w-[80px] text-right text-xs font-medium">Order</TableHead>
          <TableHead className="w-[120px] text-xs font-medium">Created</TableHead>
          <TableHead className="w-[48px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {queues?.map((queue) => (
          <TableRow key={queue.id} className="group/row cursor-pointer">
            <TableCell className="py-3 pl-6">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${group.color}12` }}
                >
                  <Inbox className="h-3.5 w-3.5" style={{ color: group.color }} />
                </div>
                <span className="text-sm font-medium">{queue.name}</span>
              </div>
            </TableCell>

            <TableCell className="py-3">
              <span className="text-muted-foreground line-clamp-1 text-sm">
                {queue.description}
              </span>
            </TableCell>

            <TableCell className="py-3 text-right">
              <span className="text-sm font-medium tabular-nums">{queue.ticketsCount}</span>
            </TableCell>

            <TableCell className="py-3 text-right">
              <Badge variant={"outline"}>{queue.order}</Badge>
            </TableCell>

            <TableCell className="py-3">
              <span className="text-muted-foreground text-xs">
                {new Date(queue.createdAt).toDateString()}
              </span>
            </TableCell>

            <TableCell className="py-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 transition-opacity group-hover/row:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
