import { PlusIcon } from "../../components/ui/Icons";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import GoalOverview from "./components/GoalOverview";
import GoalsTable from "./components/GoalsTable";

const Goals = () => {

  function handleCreateGoal() {}
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <PrimaryButton className="w-50" onClick={handleCreateGoal}>
          <PlusIcon /> Create Goal
        </PrimaryButton>
      </div>
      <GoalOverview />
      <GoalsTable />
    </div>
  );
};

export default Goals;
