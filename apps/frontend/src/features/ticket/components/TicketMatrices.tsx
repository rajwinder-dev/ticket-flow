const TicketMatrices = () => {
  return (
    <div className="grid shrink-0 grid-cols-4 border-b">
      {[
        { label: "Total Tickets", value: 3 },
        { label: "Open", value: 4 },
        { label: "In Progress", value: 3 },
        { label: "Resolved", value: 3 },
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
