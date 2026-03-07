import { PlusIcon } from "../../components/ui/Icons";
import MultiTabs from "../../components/ui/MultiTabs";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { SecondaryButton } from "../../components/ui/SecondaryButton";
import SalaryHistory from "./components/SalaryHistory";
import SalaryOverview from "./components/SalaryOverview";
import SalaryTable from "./components/SalaryTable";
 const elements = [
    { label: "Recent Salaries", component: <SalaryTable /> },
    { label: "Salary History", component: <SalaryHistory /> },
  ];
const Salary = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <PrimaryButton className="w-50">
          <PlusIcon /> pay Salary
        </PrimaryButton>
        <SecondaryButton className="w-50">Export Salary report</SecondaryButton>
        <SecondaryButton className="w-50">Export Salary Slip</SecondaryButton>
      </div>
      <SalaryOverview />
      <MultiTabs elements={elements} invertColor />
    </div>
  );
};

export default Salary;
