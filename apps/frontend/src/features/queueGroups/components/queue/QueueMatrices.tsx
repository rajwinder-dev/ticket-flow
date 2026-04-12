import { useQueue } from "@/features/queue/hooks";
import { useParams } from "react-router";

const QueueMatrices = () => {
  const { queueId } = useParams();
  const { queueSummary } = useQueue({ queueId });
  return (
    <div className="grid shrink-0 grid-cols-4 border-b">
      {[
        { label: "Total Tickets", value: queueSummary?.data.totalTickets },
        { label: "Open", value: queueSummary?.data.openTickets },
        { label: "High Priority", value: queueSummary?.data.highPriorityTickets },
        { label: "Active Agents", value: queueSummary?.data.activeAgents },
      ].map((stat, i) => (
        <div key={i} className={`flex items-center gap-2 p-4 ${i < 3 ? "border-r" : ""}`}>
          <p className="text-muted-foreground text-sm">{stat.label}:</p>
          <p className="font-semibold tracking-tight text-orange-600">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default QueueMatrices;
