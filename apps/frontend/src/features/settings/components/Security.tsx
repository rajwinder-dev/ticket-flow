import CheckBox from "../../../components/ui/CheckBox";
import { Input } from "../../../components/ui/Input";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { SecondaryButton } from "../../../components/ui/SecondaryButton";

const data = {
  password_policy: {
    min_length: 8,
    must_include_special: true,
  },
  two_factor_auth: false,
  account_lock_after_failed_attempts: 5,
};
const Security = () => {
  return (
    <div className="flex flex-col gap-x-4 gap-y-8 py-8">
      <div className="gap-4">
        <label className="block">Password Policy</label>
        <div className="flex flex-wrap items-center gap-4 rounded-xs border border-gray-300 p-4">
          <Input
            label="Password length"
            defaultValue={data.password_policy.min_length}
            type="number"
          />
          <CheckBox
            label="Include special Characters "
            defaultChecked={data.password_policy.must_include_special}
          />
        </div>
      </div>
       <div className="gap-4">
        <label className="block">Advanced Settings</label>
        <div className="flex flex-wrap items-center gap-4 rounded-xs border border-gray-300 p-4">
          <Input
            label="Max Failed Attempts"
            defaultValue={data.account_lock_after_failed_attempts}
            type="number"
          />
          <CheckBox
            label="Enable 2 Factor Auth"
            defaultChecked={data.two_factor_auth}
          />
        </div>
      </div>
      <div className="col-start-2 flex justify-end gap-4">
        <SecondaryButton>Cancel</SecondaryButton>
        <PrimaryButton>Save</PrimaryButton>
      </div>
    </div>
  );
};

export default Security;
