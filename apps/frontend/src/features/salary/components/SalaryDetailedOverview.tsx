import OverviewGrid from "../../../components/layouts/OverviewGrid";
import { CurrencyIcon, HumanIcon, PercentIcon, SheetIcon2 } from "../../../components/ui/Icons";
import OverviewCard from "../../../components/ui/OverviewCard";

const SalaryDetailedOverview = () => {
  return (
    <OverviewGrid>
      <OverviewCard icon={<HumanIcon />} value={50045} backgroundColor="gray">
        Last Paid
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard
        icon={<PercentIcon />}
        value={24}
        backgroundColor="skin"
      >
        total Paid
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard
        icon={<CurrencyIcon />}
        value={12345}
        backgroundColor="pink"
      >
        Paid last month
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard
        icon={<SheetIcon2 />}
        value={"Sales , HR, Marketing"}
        backgroundColor="sky"
      >
        Status
      </OverviewCard>
    </OverviewGrid>
  );
};

export default SalaryDetailedOverview;
