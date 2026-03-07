import OverviewGrid from "../../../components/layouts/OverviewGrid";
import { CurrencyIcon, HumanIcon } from "../../../components/ui/Icons";
import OverviewCard from "../../../components/ui/OverviewCard";

const LeaveOverview = () => {
  return (
    <OverviewGrid>
      <OverviewCard
        icon={<HumanIcon />}
        value={52}
        backgroundColor="gray"
        showBackground
      >
        Pending leaves
      </OverviewCard>
      <div></div>
      <OverviewCard
        icon={<CurrencyIcon />}
        value={345}
        backgroundColor="pink"
        showBackground
      >
        Approved Leaves
      </OverviewCard>
      <div></div>
      <OverviewCard
        icon={<CurrencyIcon />}
        value={345}
        backgroundColor="pink"
        showBackground
      >
        rejected leaves
      </OverviewCard>
      <div></div>
      <OverviewCard
        icon={<CurrencyIcon />}
        value={345}
        backgroundColor="pink"
        showBackground
      >
        leave approve rating
      </OverviewCard>
    </OverviewGrid>
  );
};

export default LeaveOverview;
