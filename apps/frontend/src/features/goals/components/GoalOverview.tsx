import OverviewGrid from "../../../components/layouts/OverviewGrid"
import { CurrencyIcon, HumanIcon, PercentIcon, SheetIcon2 } from "../../../components/ui/Icons"
import OverviewCard from "../../../components/ui/OverviewCard"

const GoalOverview = () => {
  return (
     <OverviewGrid>
      <OverviewCard icon={<HumanIcon />} value={52} backgroundColor="gray">
        Total Goals
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard
        icon={<PercentIcon />}
        value={24}
        overview={-2.4}
        backgroundColor="skin"
      >
        Pending goals
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard
        icon={<CurrencyIcon />}
        value={12345}
        backgroundColor="pink"
      >
        Recently Assigned
      </OverviewCard>
      <div className="w-[1px] bg-gray-300"></div>
      <OverviewCard icon={<SheetIcon2 />} value={3} backgroundColor="sky">
        InActive Employees
      </OverviewCard>
    </OverviewGrid>
  )
}

export default GoalOverview
