import OverviewGrid from "../../../components/layouts/OverviewGrid";
import {
  CurrencyIcon,
  HumanIcon,
  PercentIcon,
  SheetIcon2,
} from "../../../components/ui/Icons";
import OverviewCard from "../../../components/ui/OverviewCard";
const goalDetails = {
  goalId: 102,
  employeeId: "EMP2304",
  employeeName: "Sneha Reddy",
  department: "Quality Assurance",
  goalTitle: "Automate Regression Test Suite",
  description:
    "Develop and implement automated test cases for critical regression scenarios to improve testing efficiency.",
  startDate: "2025-06-15",
  dueDate: "2025-08-30",
  status: "ongoing",
  tasksCount: 6,
  completedTasks: 1,
  progress: 16,
  assignedBy: "MGR120",
  lastUpdated: "2025-06-20T08:00:00Z",
  keyResultArea: "Test Automation",
};
const TaskOverview = () => {
  let statusStyle;
  if (goalDetails.status === "ongoing") statusStyle = "bg-blue2/10 text-blue";
  if (goalDetails.status === "pending")
    statusStyle = "bg-yellow-400/10 text-yellow-400";
  if (goalDetails.status === "completed")
    statusStyle = "bg-green-400/10 text-green-400";
  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">
            Id: {goalDetails.goalId} | {goalDetails.goalTitle}
          </h1>
          <p className="text-xl">{goalDetails.description}</p>
          <p className="text-red1">
            From {goalDetails.startDate} To {goalDetails.dueDate}
          </p>
        </div>
        <div>
          <p
            className={`${statusStyle} inline-block rounded-md p-2 capitalize`}
          >
            {goalDetails.status}
          </p>
        </div>
      </div>
      <OverviewGrid>
        <OverviewCard
          icon={<HumanIcon />}
          value={goalDetails.tasksCount}
          backgroundColor="gray"
        >
          Tasks Count
        </OverviewCard>
        <div className="w-[1px] bg-gray-300"></div>
        <OverviewCard
          icon={<PercentIcon />}
          value={goalDetails.completedTasks}
          backgroundColor="skin"
        >
          completedTasks
        </OverviewCard>
        <div className="w-[1px] bg-gray-300"></div>
        <OverviewCard
          icon={<CurrencyIcon />}
          value={goalDetails.progress}
          unit="%"
          backgroundColor="pink"
        >
          Progress
        </OverviewCard>
        <div className="w-[1px] bg-gray-300"></div>
        <OverviewCard
          icon={<SheetIcon2 />}
          value={"implement new route "}
          backgroundColor="sky"
        >
          Recently completed
        </OverviewCard>
      </OverviewGrid>
    </>
  );
};

export default TaskOverview;
