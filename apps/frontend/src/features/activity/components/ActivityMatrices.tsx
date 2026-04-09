import useActivity from "../hooks";

const ActivityMatrices = () => {
  const { activitySummary } = useActivity();
  return (
    <div className="grid grid-cols-2 border-b sm:grid-cols-4">
      {[
        { label: "Total Events", value: activitySummary?.data.total },
        { label: "INFO", value: activitySummary?.data.info },
        { label: "WARN", value: activitySummary?.data.warn },
        { label: "ERROR", value: activitySummary?.data.error },
      ].map(({ label, value }, i) => (
        <div key={label} className={`${i !== 3 && "border-r"} p-2`}>
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
