import { useDashboard } from "./hooks";

const DashboardMatrices = () => {
  const { summary } = useDashboard();
  return (
    <div className="grid border-t md:grid-cols-2 xl:grid-cols-5">
      {[
        { label: "Total", value: summary?.data.TOTAL },
        { label: "Open", value: summary?.data.OPEN },
        { label: "In Progress", value: summary?.data.IN_PROGRESS },
        { label: "Resolved", value: summary?.data.RESOLVED },
        { label: "OnHold", value: summary?.data.ON_HOLD },
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
