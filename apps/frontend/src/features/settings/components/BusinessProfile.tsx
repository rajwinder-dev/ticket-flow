import CheckBox from "../../../components/ui/CheckBox";
import { Input } from "../../../components/ui/Input";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { SecondaryButton } from "../../../components/ui/SecondaryButton";
import { Textarea } from "../../../components/ui/TextArea";
const data = {
  name: "Tiven Technologies",
  logo: "/uploads/logo.png",
  timezone: "Asia/Kolkata",
  working_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  working_hours: {
    start: "09:00",
    end: "18:00",
  },
};
const BusinessProfile = () => {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 py-8">
      <Input label="Company Name" type="text" defaultValue={data.name} />
      <Input label="Time Zone" type="text" defaultValue={data.timezone} />
      <Input label="Company Phone No" type="text" defaultValue={data.name} />
      <Input label="Services" type="text" defaultValue={data.name} />
      <Input label="company Size" type="text" defaultValue={data.name} />
      <Input label="City" type="text" defaultValue={data.name} />
      <Input label="State" type="text" defaultValue={data.name} />
      <Input label="Zip Code" type="text" defaultValue={data.name} />
      <div className="col-span-2">
        <Textarea defaultValue={data.name} label="Company Description" />
      </div>
      <div className="col-span-2">
        <label className="block">Working Days </label>
        <div className="flex flex-wrap items-center gap-4 rounded-xs border border-gray-300 p-4">
          <CheckBox label="Monday" defaultChecked />
          <CheckBox label="Tuesday" defaultChecked />
          <CheckBox label="Wednesday" defaultChecked />
          <CheckBox label="Thursday" defaultChecked />
          <CheckBox label="friday" defaultChecked />
          <CheckBox label="saturday" />
          <CheckBox label="Sunday" />
        </div>
      </div>
      <div className="col-span-2">
        <label className="block">Working Hours </label>
        <div className="flex flex-wrap items-center justify-start gap-4 rounded-xs border border-gray-300 p-4">
          <label>From: </label>
          <div>
            <Input type="time" defaultValue={data.working_hours.start} />
          </div>
          <label>To: </label>
          <div>
            <Input type="time" defaultValue={data.working_hours.end} />
          </div>
        </div>
      </div>
      <div className="col-start-2 flex gap-4 justify-end">
        <SecondaryButton>Cancel</SecondaryButton>
        <PrimaryButton>Save</PrimaryButton>
      </div>
    </div>
  );
};

export default BusinessProfile;
