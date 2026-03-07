import OverviewGrid from "../../components/layouts/OverviewGrid";
import {
  CurrencyIcon,
  HumanIcon,
  PercentIcon,
  SheetIcon2,
} from "../../components/ui/Icons";
import LineChart from "../../components/ui/LIneChart";
import OverviewCard from "../../components/ui/OverviewCard";

function Dashboard() {
  return (
    <div className="flex flex-col gap-4">
      <OverviewGrid>
        <OverviewCard icon={<HumanIcon />} value={52} backgroundColor="gray">
          Total Employees
        </OverviewCard>
        <div className="w-[1px] bg-gray-300"></div>
        <OverviewCard icon={<PercentIcon />} value={24} backgroundColor="skin">
          Departments
        </OverviewCard>
        <div className="w-[1px] bg-gray-300"></div>
        <OverviewCard
          icon={<CurrencyIcon />}
          value={`${23}/${0}`}
          backgroundColor="pink"
          overview={+23}
          comparWith="vs last month"
        >
          Present Employees
        </OverviewCard>
        <div className="w-[1px] bg-gray-300"></div>
        <OverviewCard icon={<SheetIcon2 />} value={3} backgroundColor="sky">
          Pending Leaves
        </OverviewCard>
      </OverviewGrid>

      <OverviewGrid className="bg-transparent gap-4">
        <OverviewCard
          icon={<HumanIcon />}
          value={52}
          backgroundColor="gray"
          showBackground
        >
          Active Goals
        </OverviewCard>
        <div></div>
        <OverviewCard
          icon={<PercentIcon />}
          value={24}
          backgroundColor="skin"
          showBackground
        >
          Active Tasks
        </OverviewCard>
        <div></div>
        <OverviewCard
          icon={<CurrencyIcon />}
          value={`${23}/${0}`}
          backgroundColor="pink"
          overview={+23}
          comparWith="vs last month"
          showBackground
        >
          upcoming Deadlines
        </OverviewCard>
        <div></div>
        <OverviewCard
          icon={<SheetIcon2 />}
          value={3145}
          unit="$"
          backgroundColor="sky"
          showBackground
        >
          Salary Expense
        </OverviewCard>
      </OverviewGrid>
      <LineChart />
    </div>
  );
}

export default Dashboard;
