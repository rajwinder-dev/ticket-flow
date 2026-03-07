import OverviewGrid from "../../../components/layouts/OverviewGrid";
import {
  CurrencyIcon,
  HumanIcon,
  PercentIcon,
  SheetIcon2,
} from "../../../components/ui/Icons";
import OverviewCard from "../../../components/ui/OverviewCard";

function ReviewOverview() {
  return (
    <OverviewGrid>
      <OverviewCard icon={<HumanIcon />} value={52} backgroundColor="gray">
        Review This month
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard
        icon={<PercentIcon />}
        value={24}
        overview={-2.4}
        backgroundColor="skin"
      >
        Total Reviews
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard
        icon={<CurrencyIcon />}
        value={34}
        backgroundColor="pink"
      >
        Average Rating
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard icon={<SheetIcon2 />} value={3} backgroundColor="sky">
        Top employees
      </OverviewCard>
    </OverviewGrid>
  );
}

export default ReviewOverview;
