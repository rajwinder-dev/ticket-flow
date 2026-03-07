import OverviewGrid from "../../../components/layouts/OverviewGrid";
import {
  CurrencyIcon,
  HumanIcon,
  PercentIcon,
} from "../../../components/ui/Icons";
import OverviewCard from "../../../components/ui/OverviewCard";

const ExtraPaymentOverview = () => {
  return (
    <>
      <OverviewGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" disableDefaultGrid>
        <OverviewCard icon={<HumanIcon />} value={52} backgroundColor="gray">
          Paid Last month
        </OverviewCard>
        <OverviewCard
          icon={<PercentIcon />}
          value={24}
          unit="$"
          backgroundColor="skin"
        >
          Total Payed
        </OverviewCard>
        <OverviewCard
          icon={<CurrencyIcon />}
          value={12345}
          unit="$"
          backgroundColor="pink"
        >
          Paid this Month
        </OverviewCard>
      </OverviewGrid>
    </>
  );
};

export default ExtraPaymentOverview;
