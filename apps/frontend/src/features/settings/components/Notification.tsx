import CheckBox from "../../../components/ui/CheckBox";
import { Input } from "../../../components/ui/Input";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { SecondaryButton } from "../../../components/ui/SecondaryButton";

const data = {
  email_enabled: true,
  sms_enabled: false,
  default_templates: {
    leave_approval: "Your leave request has been {{status}}.",
    salary_slip: "Your salary slip for {{month}} is ready.",
    welcome: "Welcome to {{company_name}}!",
  },
};
const Notification = () => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 py-8">
        <div className="col-span-2">
          <label className="block">General Notification</label>
          <div className="flex flex-wrap items-center gap-4 rounded-xs border border-gray-300 p-4">
            <CheckBox
              label="Email enabled "
              defaultChecked={data.email_enabled}
            />
            <CheckBox label="Sms enabled " defaultChecked={data.sms_enabled} />
          </div>
        </div>
        <div className="col-span-2">
          <label className="block"> Default Template</label>
          <div className="grid grid-cols-[auto_1fr] items-center gap-4 rounded-xs border border-gray-300 p-4">
            <label className="w-32">Welcome: </label>
            <Input type="string" defaultValue={data.default_templates.welcome} />
            <label className="w-32">Leave Approval: </label>
            <Input type="text" defaultValue={data.default_templates.leave_approval} />
            <label className="w-32">Salary Slip: </label>
            <Input type="string" defaultValue={data.default_templates.salary_slip} />
          </div>
        </div>
        <div className="col-start-2 flex justify-end gap-4">
          <SecondaryButton>Cancel</SecondaryButton>
          <PrimaryButton>Save</PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default Notification;
