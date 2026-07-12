const CustomerMatrices = () => {
  return (
    <div className="grid shrink-0 grid-cols-3 border-b">
      {[
        { label: "Total Customers", value: 3 },
        { label: "Open Tickets", value: 4 },
        { label: "last Month tickets", value: 3 },
      ].map((stat, i) => (
        <div key={i} className={`flex items-center gap-2 p-4 ${i < 3 ? "border-r" : ""}`}>
          <p className="text-muted-foreground text-sm">{stat.label}:</p>
          <p className="font-semibold tracking-tight text-orange-600">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default CustomerMatrices;
