import UserOverview from "../../../components/ui/UserOverview";
import SalaryDetailedOverview from "./SalaryDetailedOverview";
import SalaryHistory from "./SalaryHistory";

const SalaryDetails = () => {
  return (
    <div>
      <UserOverview />
      <SalaryDetailedOverview />
      {/* add or pass api function  */}
      <SalaryHistory />
    </div>
  );
};

export default SalaryDetails;
