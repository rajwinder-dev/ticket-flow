import MultiTabs from "../../components/ui/MultiTabs";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import LeaveHistory from "./components/LeaveHistory";
import LeaveOverview from "./components/LeaveOverview";
import RecentLeaves from "./components/RecentLeaves";
const elements = [
  { label: "Recent leaves ", component: <RecentLeaves /> },
  { label: "Leave history", component: <LeaveHistory /> },
];
const Leaves = () => {
  function handleApplyLeave() {}
  return (
    <div className="flex flex-col gap-4">
      <PrimaryButton className="w-50" onClick={handleApplyLeave}>
        apply leave
      </PrimaryButton>
      <LeaveOverview />
      <MultiTabs elements={elements} />
    </div>
  );
};

export default Leaves;
