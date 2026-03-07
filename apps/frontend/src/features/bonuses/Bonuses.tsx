import { PlusIcon } from "../../components/ui/Icons";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { SecondaryButton } from "../../components/ui/SecondaryButton";
import ExtraPaymentOverview from "./components/ExtraPaymentOverview";
import ExtraPaymentTable from "./components/ExtraPaymentTable";

const Bonuses = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <PrimaryButton className="w-50">
          <PlusIcon /> Pay Extra
        </PrimaryButton>
        <SecondaryButton className="w-50">Export Report</SecondaryButton>
        <SecondaryButton className="w-50">Export Salary Slip</SecondaryButton>
      </div>
      <ExtraPaymentOverview />
      <ExtraPaymentTable />
    </div>
  );
};

export default Bonuses;
