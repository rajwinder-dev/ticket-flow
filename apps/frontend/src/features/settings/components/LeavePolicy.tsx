import CheckBox from "../../../components/ui/CheckBox";
import { PlusCircleIcon } from "../../../components/ui/Icons";
import { Input } from "../../../components/ui/Input";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { SecondaryButton } from "../../../components/ui/SecondaryButton";
import SelectInput from "../../../components/ui/SelectInput";

const data = {
  annual_leave_days: 24,
  leave_types: ["sick", "casual", "earned"],
  carry_forward: true,
  max_carry_days: 10,
  approval_flow: "manager_first",
  leave_request_deadline: "2 days before",
};
const LeavePolicy = () => {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 py-8">
      <Input
        label=" Max Annual Leave Days "
        type="number"
        defaultValue={data.annual_leave_days}
      />
      <Input
        label="Max Carry Days"
        type="number"
        defaultValue={data.max_carry_days}
      />
      <SelectInput label="Approval Flow">
        <SelectInput.Option value="test">Select Flow</SelectInput.Option>
        <SelectInput.Option value="test">Manager First</SelectInput.Option>
        <SelectInput.Option value="test">Admin First</SelectInput.Option>
        <SelectInput.Option value="test">test</SelectInput.Option>
      </SelectInput>
      <div className="col-span-2">
        <label className="block">Other Policy</label>
        <div className="flex flex-wrap items-center gap-4 rounded-xs border border-gray-300 p-4">
          <CheckBox
            label="Carry Forward "
            defaultChecked={data.carry_forward}
          />
        </div>
      </div>
      <div className="col-span-2">
        <label className="block">Leave types</label>
        <div className="flex flex-wrap items-center gap-4 rounded-xs border border-gray-300 p-4">
          <span className="flex gap-2 rounded-full bg-blue-200 px-2 text-blue-700">
            Sick
            <button className="text-xs hover:cursor-pointer">❌</button>
          </span>
          <span className="flex gap-2 rounded-full bg-blue-200 px-2 text-blue-700">
            Casual
            <button className="text-xs hover:cursor-pointer">❌</button>
          </span>
          <span className="flex gap-2 rounded-full bg-blue-200 px-2 text-blue-700">
            Urgent
            <button className="text-xs hover:cursor-pointer">❌</button>
          </span>
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

export default LeavePolicy;
