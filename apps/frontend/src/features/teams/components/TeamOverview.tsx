import OverviewGrid from "../../../components/layouts/OverviewGrid";
import {
  CurrencyIcon,
  HumanIcon,
  PercentIcon,
  SheetIcon2,
} from "../../../components/ui/Icons";
import OverviewCard from "../../../components/ui/OverviewCard";

const TeamOverview = () => {
  return (
    <OverviewGrid>
      <OverviewCard icon={<HumanIcon />} value={52} backgroundColor="gray">
        Total Teams
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard
        icon={<PercentIcon />}
        value={24}
        overview={-2.4}
        backgroundColor="skin"
      >
        Average Team Size
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard icon={<CurrencyIcon />} value={24} backgroundColor="pink">
        Goals Assigned
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard icon={<SheetIcon2 />} value={3} backgroundColor="sky">
        Pending Goals
      </OverviewCard>
    </OverviewGrid>
  );
};

export default TeamOverview;
