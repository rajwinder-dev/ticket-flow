import { useTicket } from "@org/core";
import { Skeleton } from "@/components/ui/skeleton"; // Adjust this import path based on your file structure

const TicketMatrices = () => {
  const { ticketSummary, isLoadingTicketSummary } = useTicket();

  const stats = [
    { label: "Total Tickets", value: ticketSummary?.data.total },
    { label: "Open", value: ticketSummary?.data.open },
    { label: "In Progress", value: ticketSummary?.data.inProgress },
    { label: "Resolved", value: ticketSummary?.data.resolved },
  ];

  return (
    <div className="grid shrink-0 grid-cols-4 border-b">
      {isLoadingTicketSummary
        ? // Loading Skeletons: matches layout exactly to avoid shifting
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`flex items-center gap-2 p-4 ${i < 3 ? "border-r" : ""}`}>
              <Skeleton className="h-4 w-20" /> {/* Skeleton for the label */}
              <Skeleton className="h-5 w-8" /> {/* Skeleton for the metric value */}
            </div>
          ))
        : // Loaded Content
          stats.map((stat, i) => (
            <div key={i} className={`flex items-center gap-2 p-4 ${i < 3 ? "border-r" : ""}`}>
              <p className="text-muted-foreground text-sm">{stat.label}:</p>
              <p className="font-semibold tracking-tight text-orange-600">{stat.value ?? 0}</p>
            </div>
          ))}
    </div>
  );
};

export default TicketMatrices;
