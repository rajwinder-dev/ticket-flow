import { useTicket } from "../hooks";

const TicketMatrices = () => {
  const {ticketSummary} = useTicket();
  return (
    <div className="grid shrink-0 grid-cols-4 border-b">
      {[
        { label: "Total Tickets", value: ticketSummary?.data.total },
        { label: "Open", value: ticketSummary?.data.open },
        { label: "In Progress", value: ticketSummary?.data.inProgress },
        { label: "Resolved", value: ticketSummary?.data.resolved },
      ].map((stat, i) => (
        <div key={i} className={`flex items-center gap-2 p-4 ${i < 3 ? "border-r" : ""}`}>
          <p className="text-muted-foreground text-sm">{stat.label}:</p>
          <p className="font-semibold tracking-tight text-orange-600">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default TicketMatrices;
