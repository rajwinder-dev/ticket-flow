import OverviewGrid from "../../../components/layouts/OverviewGrid";
import {
  CurrencyIcon,
  HumanIcon,
  PercentIcon,
  SheetIcon2,
} from "../../../components/ui/Icons";
import OverviewCard from "../../../components/ui/OverviewCard";

const PunchInsOverview = () => {
  return (
    <OverviewGrid>
      <OverviewCard icon={<HumanIcon />} value={52} backgroundColor="gray">
        Total present
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard icon={<PercentIcon />} value={24} backgroundColor="skin">
        Pending Attendance
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard
        icon={<CurrencyIcon />}
        value={12345}
        backgroundColor="pink"
        overview={-2.4}
      >
        Average monthly
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard icon={<SheetIcon2 />} value={3} backgroundColor="sky">
        InActive Employees
      </OverviewCard>
    </OverviewGrid>
  );
};

export default PunchInsOverview;
