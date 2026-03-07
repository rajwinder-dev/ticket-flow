import CheckBox from "../../../components/ui/CheckBox";
import { PlusCircleIcon } from "../../../components/ui/Icons";
import { Input } from "../../../components/ui/Input";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { SecondaryButton } from "../../../components/ui/SecondaryButton";
const data = {
  salary_cycle: "monthly",
  salary_generation_day: 28,
  salary_template: {
    basic: 50,
    hra: 30,
    bonus: 10,
    others: 10,
  },
  tax_deduction_enabled: true,
  pf_deduction: false,
};
const Payroll = () => {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 py-8">
      <Input
        label="salary Cycle"
        type="text"
        defaultValue={data.salary_cycle}
      />
      <Input
        label="Salary Generation Day"
        type="number"
        defaultValue={data.salary_generation_day}
      />
      <div className="col-span-2">
        <label className="block">Other Policy</label>
        <div className="flex flex-wrap items-center gap-4 rounded-xs border border-gray-300 p-4">
          <CheckBox
            label="Tax deduction "
            defaultChecked={data.tax_deduction_enabled}
          />
          <CheckBox label="Pf deduction" defaultChecked={data.pf_deduction} />
        </div>
      </div>
      <div className="col-span-2">
        <label className="block"> Salary Template</label>
        <div className="grid grid-cols-[auto_auto_auto_auto] place-content-start items-center gap-4 rounded-xs border border-gray-300 p-4">
          <label className="w-12">Base: </label>
          <Input type="number" defaultValue={50} />
          <span>❌</span>
          <PlusCircleIcon />
          <label className="w-20">hr: </label>
          <Input type="number" defaultValue={10} />
          <span>❌</span>
          <PlusCircleIcon />
          <label className="w-20">bonus: </label>
          <Input type="number" defaultValue={30} />
          <span>❌</span>
          <PlusCircleIcon />
        </div>
      </div>
      <div className="col-start-2 flex justify-end gap-4">
        <SecondaryButton>Cancel</SecondaryButton>
        <PrimaryButton>Save</PrimaryButton>
      </div>
    </div>
  );
};

export default Payroll;
