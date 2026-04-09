const ActivityMatrices = () => {
  return (
    <div className="grid grid-cols-2 border-b sm:grid-cols-4">
      {[
        { label: "Total Events", value: 4 },
        { label: "INFO", value: 5 },
        { label: "WARN", value: 9 },
        { label: "ERROR", value: 4 },
      ].map(({ label, value }) => (
        <div key={label} className="border-r p-4">
          <div className="flex items-center gap-4 px-4 py-0">
            <p className="text-muted-foreground text-md">{label}</p>
            <p className="text-2xl font-bold tabular-nums">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityMatrices;
