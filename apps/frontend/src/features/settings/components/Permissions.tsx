import CheckBox from "../../../components/ui/CheckBox";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { SecondaryButton } from "../../../components/ui/SecondaryButton";

// const data = {
//   admin: [
//     "manage_users",
//     "manage_roles",
//     "manage_payroll",
//     "manage_leave_policy",
//     "view_reports",
//   ],
//   manager: ["view_team", "approve_leave", "view_attendance", "submit_reviews"],
//   employee: ["view_profile", "request_leave", "download_payslip"],
// };

const Permissions = () => {
  return (
    <div className="flex flex-col gap-x-4 gap-y-8 py-8">
      <div className="gap-4">
        <label className="block">Admin permissions</label>
        <div className="flex flex-wrap items-center gap-4 rounded-xs border border-gray-300 p-4">
          <CheckBox label="Manage Users" />
          <CheckBox label="Mange Roles" />
          <CheckBox label="Manager Payroll" />
          <CheckBox label="Mange leave Policy" />
          <CheckBox label="view Reports" />
        </div>
      </div>
      <div className="gap-4">
        <label className="block">Manager permissions</label>
        <div className="flex flex-wrap items-center gap-4 rounded-xs border border-gray-300 p-4">
          <CheckBox label="Manage Users" defaultChecked/>
          <CheckBox label="Mange Roles" defaultChecked />
          <CheckBox label="Manager Payroll" defaultChecked/>
          <CheckBox label="Mange leave Policy" />
          <CheckBox label="view Reports" />
        </div>
      </div>
      <div className="gap-4">
        <label className="block">Employee permissions</label>
        <div className="flex flex-wrap items-center gap-4 rounded-xs border border-gray-300 p-4">
          <CheckBox label="Manage Users" />
          <CheckBox label="Mange Roles" />
          <CheckBox label="Manager Payroll" defaultChecked />
          <CheckBox label="Mange leave Policy" defaultChecked/>
          <CheckBox label="view Reports" />
        </div>
      </div>

      <div className="col-start-2 flex justify-end gap-4">
        <SecondaryButton>Cancel</SecondaryButton>
        <PrimaryButton>Save</PrimaryButton>
      </div>
    </div>
  );
};

export default Permissions;
