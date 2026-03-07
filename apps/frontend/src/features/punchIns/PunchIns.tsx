import MultiTabs from "../../components/ui/MultiTabs";
import AttendanceHistory from "./components/AttendanceHistory";
import AttendanceTable from "./components/AttendenceTable";
import PunchInsOverview from "./components/PunchInsOverview";

const PunchIns = () => {
  const elements = [
    { label: "Attendance today", component: <AttendanceTable /> },
    { label: "Attendance history", component: <AttendanceHistory /> },
  ];
  return (
    <div className="flex flex-col gap-4">
      <PunchInsOverview />
      <MultiTabs elements={elements} />
    </div>
  );
};

export default PunchIns;
