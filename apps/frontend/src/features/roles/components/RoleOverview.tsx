import OverviewGrid from "../../../components/layouts/OverviewGrid";
import { CurrencyIcon, HumanIcon } from "../../../components/ui/Icons";
import OverviewCard from "../../../components/ui/OverviewCard";

const RoleOverview = () => {
  return (
    <div>
      <OverviewGrid>
        <OverviewCard
          icon={<HumanIcon />}
          value={52}
          backgroundColor="gray"
          showBackground
        >
          Employees
        </OverviewCard>
        <div></div>
        <OverviewCard
          icon={<CurrencyIcon />}
          value={345}
          backgroundColor="pink"
          showBackground
        >
          Managers
        </OverviewCard>
        <div></div>
        <OverviewCard
          icon={<CurrencyIcon />}
          value={345}
          backgroundColor="pink"
          showBackground
        >
          Admins
        </OverviewCard>
        <div></div>
        <OverviewCard
          icon={<CurrencyIcon />}
          value={345}
          backgroundColor="pink"
          showBackground
        >
          unAssigned Roles
        </OverviewCard>
      </OverviewGrid>
    </div>
  );
};

export default RoleOverview;
