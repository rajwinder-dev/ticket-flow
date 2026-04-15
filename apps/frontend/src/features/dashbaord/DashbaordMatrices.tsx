const DashboardMatrices = () => {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-5">
      {[
        { label: "Total", value: 4 },
        { label: "Open", value: 5 },
        { label: "In Progress", value:5 },
        { label: "Resolved", value: 5 },
        { label: "Critical", value: 5 },
      ].map((item, i) => (
        <div key={i} className={`flex items-center gap-2 p-4 ${i < 5 ? "border-r" : ""}`}>
          <p className="text-muted-foreground text-sm">{item.label}:</p>
          <p className="font-semibold tracking-tight text-orange-600">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardMatrices;
