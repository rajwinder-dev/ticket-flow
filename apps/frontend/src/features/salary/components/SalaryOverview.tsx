import OverviewGrid from "../../../components/layouts/OverviewGrid";
import {
  CurrencyIcon,
  HumanIcon,
  PercentIcon,
  SheetIcon2,
} from "../../../components/ui/Icons";
import OverviewCard from "../../../components/ui/OverviewCard";

const SalaryOverview = () => {
  return (
    <>
      <OverviewGrid>
        <OverviewCard icon={<HumanIcon />} value={52} backgroundColor="gray">
          Employee Paid
        </OverviewCard>
        <div className="w-[1px] bg-gray-300"></div>
        <OverviewCard
          icon={<PercentIcon />}
          value={24}
          overview={-2.4}
          backgroundColor="skin"
        >
          Total Pending
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
          Pending Department
        </OverviewCard>
      </OverviewGrid>
    </>
  );
};

export default SalaryOverview;
