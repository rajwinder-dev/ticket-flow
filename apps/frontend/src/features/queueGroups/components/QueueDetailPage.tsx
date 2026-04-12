import { useQueue } from "@/features/queue/hooks";
import { formatDate } from "@/lib/utils";
import { useParams } from "react-router";
import { QueueAgentTable } from "./queue/QueueAgentTable";
import QueueMatrices from "./queue/QueueMatrices";
import { QueueTicketTable } from "./queue/QueueTicketTable";

const QueueDetailPage = () => {
  const { queueId } = useParams();
  const { queuesDetails } = useQueue({ queueId });

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* ── Header ── */}
      <div className="bg-background flex shrink-0 items-start justify-between gap-4 border-b px-6 py-4">
        <div>
          <p className="text-muted-foreground font-mono text-xs">
            Queues / <span className="font-medium text-orange-600">{queuesDetails?.data.id}</span>
          </p>
          <h1 className="mt-0.5 text-xl font-semibold tracking-tight">
            {queuesDetails?.data.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            {queuesDetails?.data.queueGroup?.name} · Created{" "}
            {queuesDetails?.data.createdAt && formatDate(queuesDetails?.data.createdAt)}
          </p>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <QueueMatrices />

      {/* ── Two-column body ── */}
      <div className="flex flex-1 divide-x overflow-hidden">
        {/* ── LEFT: Tickets ── */}
        <QueueTicketTable />

        {/* ── RIGHT: Agents ── */}
        <QueueAgentTable />
      </div>
    </div>
  );
};

export default QueueDetailPage;
