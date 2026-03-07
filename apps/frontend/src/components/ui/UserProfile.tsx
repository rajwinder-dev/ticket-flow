import { useAuth } from "../../context/AuthContext";
import { useGeneralContext } from "../../context/generalContext";
import { NotificationIcon } from "./Icons";
import ProfilePic from "./ProfilePic";

function UserProfile() {
  const { userRole } = useAuth();
  const { toggleDarkMode } = useGeneralContext();
  return (
    <div className="flex items-center gap-8">
      <button onClick={toggleDarkMode}>dark</button>
      <NotificationIcon />
      <div className="grid grid-cols-[auto_1fr] grid-rows-2 items-center gap-x-4">
        <ProfilePic image={userRole?.image} />
        <p className="text-sm">
          {userRole?.username}
          <span className="font-semibold text-red-400"> {userRole?.name}</span>
        </p>
        <p className="text-sm text-gray-500">{userRole?.email}</p>
      </div>
    </div>
  );
}

export default UserProfile;
