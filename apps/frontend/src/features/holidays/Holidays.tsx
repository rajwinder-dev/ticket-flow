import { PlusIcon } from "../../components/ui/Icons";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { SecondaryButton } from "../../components/ui/SecondaryButton";
import HolidaysTable from "./components/HolidaysTable";

const Holidays = () => {
  function handleCreateHoliday() {}
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <PrimaryButton className="w-50" onClick={handleCreateHoliday}>
          <PlusIcon /> Add new Holiday
        </PrimaryButton>
        <SecondaryButton className="w-50">Upload CSV</SecondaryButton>
        <SecondaryButton className="w-50">Edit Weekends</SecondaryButton>
      </div>
      <HolidaysTable />
    </div>
  );
};

export default Holidays;
