import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { QueueGroupSchemaResponse, QueueSchemaResponse } from "@repo/schemas";
import { ChevronDown, ChevronUp, Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueueActions } from "../../useQueueActions";
import { QueueActionsMenu } from "./QueueActionMenu";
import { QueueFormModal } from "./QueueFormModel";

interface QueueTableProps {
  group: QueueGroupSchemaResponse;
  queues: QueueSchemaResponse[] | undefined;
}

export function QueueTable({ queues }: QueueTableProps) {
  const { editingQueue, isEditModalOpen, moveUp, moveDown, openEditModal, closeEditModal } =
    useQueueActions();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[220px] pl-6 text-xs font-medium">Queue</TableHead>
            <TableHead className="text-xs font-medium">Description</TableHead>
            <TableHead className="w-[100px] text-right text-xs font-medium">
              Total Tickets
            </TableHead>
            <TableHead className="w-[100px] text-center text-xs font-medium">
              Total Agents
            </TableHead>
            <TableHead className="w-[100px] text-center text-xs font-medium">Order</TableHead>
            <TableHead className="w-[120px] text-xs font-medium">Created</TableHead>
            <TableHead className="w-[48px]" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {queues?.map((queue, index) => (
            <TableRow key={queue.id} className="group/row cursor-pointer">
              <TableCell className="py-3 pl-6">
                <div className="flex items-center gap-2.5">
                  <div className="bg-muted flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                    <Inbox className="text-foreground h-3.5 w-3.5" />
                  </div>
                  <Link to={`${queue.id}`} className="text-sm font-medium hover:underline">
                    {queue.name}
                  </Link>
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
                <span className="text-sm font-medium tabular-nums">{queue.agentsCount}</span>
              </TableCell>
              <TableCell className="py-3">
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveUp(queue.id);
                    }}
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </Button>

                  <Badge variant="outline" className="min-w-[28px] justify-center tabular-nums">
                    {queue.order}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={index === queues.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveDown(queue.id);
                    }}
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>

              {/* Created at */}
              <TableCell className="py-3">
                <span className="text-muted-foreground text-xs">
                  {new Date(queue.createdAt).toDateString()}
                </span>
              </TableCell>

              {/* Actions */}
              <TableCell className="py-3">
                <QueueActionsMenu queue={queue} onEdit={openEditModal} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <QueueFormModal open={isEditModalOpen} queue={editingQueue} onClose={closeEditModal} />
    </>
  );
}
