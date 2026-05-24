import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton"; // Import shadcn skeleton
import type { QueueGroupSchemaResponse, QueueSchemaResponse } from "@repo/schemas";
import { Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueueActions } from "../../useQueueActions";
import { QueueActionsMenu } from "./QueueActionMenu";
import { QueueFormModal } from "./QueueFormModel";

interface QueueTableProps {
  group: QueueGroupSchemaResponse;
  queues: QueueSchemaResponse[] | undefined;
  isLoadingQueues: boolean;
}

export function QueueTable({ queues, isLoadingQueues }: QueueTableProps) {
  const { editingQueue, isEditModalOpen, openEditModal, closeEditModal } = useQueueActions();

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
          {isLoadingQueues
            ? // Layout-proportional table skeletons to prevent alignment shifts
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell className="py-3 pl-6">
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="h-7 w-7 shrink-0 rounded-lg" /> {/* Icon box */}
                      <Skeleton className="h-4 w-28" /> {/* Queue name string */}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-11/12" /> {/* Description line */}
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="ml-auto h-4 w-8" /> {/* Tickets numerical total */}
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="mx-auto h-4 w-8" /> {/* Agents numerical total */}
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="mx-auto h-5 w-7 rounded-full" /> {/* Badge pill outline */}
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-3 w-20" /> {/* Created date timestamp */}
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="ml-auto h-8 w-8 rounded-md" />{" "}
                    {/* Dropdown dot container */}
                  </TableCell>
                </TableRow>
              ))
            : queues?.map((queue) => (
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
                  <TableCell className="py-3 text-center">
                    {" "}
                    {/* Swapped to text-center to match table header definitions */}
                    <span className="text-sm font-medium tabular-nums">{queue.agentsCount}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Badge variant="outline" className="min-w-[28px] justify-center tabular-nums">
                        {queue.order}
                      </Badge>
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
