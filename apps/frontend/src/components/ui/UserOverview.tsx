import { MailIcon, PhoneIcon, SmsIcon, UserIcon } from "./Icons";

const UserOverview = () => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="bg-sky flex h-20 w-20 items-center justify-center rounded-full">
        <UserIcon />
      </div>
      <div className="flex flex-1 flex-col gap-4 py-8">
        <h2 className="text-xl font-semibold">
          Emery Dokidis <span className="text-green1 text-sm">Active</span>
        </h2>
        <p className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <MailIcon /> emerydokidis@gmail.com
          </span>
          <span className="flex items-center gap-2">
            <PhoneIcon /> +979970174715
          </span>
        </p>
      </div>
      <div className="flex items-center gap-4">
        <SmsIcon /> <PhoneIcon /> <MailIcon />
      </div>
    </div>
  );
};

export default UserOverview;
