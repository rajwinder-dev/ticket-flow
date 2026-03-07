import OverviewGrid from "../../../components/layouts/OverviewGrid";
import {
  CurrencyIcon,
  HumanIcon,
  PercentIcon,
  SheetIcon2,
} from "../../../components/ui/Icons";
import OverviewCard from "../../../components/ui/OverviewCard";

function EmployeeOverview() {
  return (
    <OverviewGrid>
      <OverviewCard icon={<HumanIcon />} value={52} backgroundColor="gray">
        Total Employees
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard
        icon={<PercentIcon />}
        value={24}
        overview={-2.4}
        backgroundColor="skin"
      >
        Total Departments
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard
        icon={<CurrencyIcon />}
        value={12345}
        backgroundColor="pink"
      >
        Managers
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard icon={<SheetIcon2 />} value={3} backgroundColor="sky">
        InActive Employees
      </OverviewCard>
    </OverviewGrid>
  );
}

export default EmployeeOverview;
