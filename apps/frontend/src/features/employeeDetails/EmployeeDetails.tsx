import {
  BackIcon,
  CardBoardIcon,
  CurrencyIcon,
  HumanIcon,
  PercentIcon,
  RefreshIcon,
  RewardIcon,
  SheetIcon2,
  SheetIcon3,
  SmsIcon,
} from "../../components/ui/Icons";
import OverviewCard from "../../components/ui/OverviewCard";
import OverviewGrid from "../../components/layouts/OverviewGrid";
import MultiTabs from "../../components/ui/MultiTabs";
import EmployeeProfile from "../employees/components/EmployeeProfile";
import { useNavigate } from "react-router";
import UserOverview from "../../components/ui/UserOverview";
const detailTabs = [
  {
    label: "Profile",
    icon: <SheetIcon3 />,
    component: <EmployeeProfile />,
  },
  {
    label: "Task history",
    icon: <RefreshIcon />,
    component: "",
  },
  {
    label: "Reviews & feedbacks",
    icon: <RewardIcon />,
    component: "",
  },
  {
    label: "Salary Details",
    icon: <CardBoardIcon />,
    component: "",
  },
  {
    label: "Interactions & Chat",
    icon: <SmsIcon />,
    component: "",
  },
];
const EmployeeDetails = () => {
  const navigate = useNavigate();
  return (
    <div className="">
      <button
        className="flex cursor-pointer items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <BackIcon /> Back
      </button>
      <div className="my-4 rounded-md bg-white p-4">
        <UserOverview />
        <OverviewGrid>
          <OverviewCard
            icon={<HumanIcon />}
            value={52}
            backgroundColor="gray"
            showBackground={true}
          >
            Total Tasks
          </OverviewCard>
          <div></div>
          <OverviewCard
            icon={<PercentIcon />}
            value={24}
            backgroundColor="skin"
            showBackground={true}
          >
            Task Reviews
          </OverviewCard>
          <div></div>
          <OverviewCard
            icon={<CurrencyIcon />}
            value={14}
            backgroundColor="pink"
            showBackground={true}
          >
            Total Leaves
          </OverviewCard>
          <div></div>
          <OverviewCard
            icon={<SheetIcon2 />}
            value={"22-10-1823"}
            backgroundColor="sky"
            showBackground={true}
          >
            Total Salary
          </OverviewCard>
        </OverviewGrid>
      </div>
      <MultiTabs elements={detailTabs} style="advance" />
    </div>
  );
};

export default EmployeeDetails;
