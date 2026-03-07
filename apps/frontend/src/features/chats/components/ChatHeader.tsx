import { SettingIcon } from "../../../components/ui/Icons";
import ProfilePic from "../../../components/ui/ProfilePic";

const ChatHeader = () => {
  return (
    <div className="flex shrink-0 items-center justify-between gap-4 border-b py-2">
      <ProfilePic
        image={"https://randomuser.me/api/portraits/women/5.jpg"}
        classname="h-12 w-12"
      />
      <div className="flex flex-1 flex-col">
        <span className="font-semibold">Eva Green</span>
        <span className="text-sm text-gray-400">
          Last seen {new Date().toDateString()} at 8:34
        </span>
      </div>
      <SettingIcon/>
    </div>
  );
};

export default ChatHeader;
