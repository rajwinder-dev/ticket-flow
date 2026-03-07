import { format } from "date-fns";
import ProfilePic from "../../../components/ui/ProfilePic";
interface props {
  users: {
    id: string,
    avatar: string;
    name: string;
    status: string,
    lastMessageDate: string,
    lastMessage: string
  }[]
}
const ChatRooms = ({users}: props) => {
  return (
    <div className="flex flex-col gap-4 overflow-auto">
      {users.map((item) => (
        <div
          key={item.id}
          className="flex cursor-pointer gap-4 rounded-md p-2 hover:bg-gray-200"
        >
          <ProfilePic image={item.avatar} classname="h-12 w-12" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2">
                {item.name}
                <span
                  className={`relative flex h-3 w-3 pt-1 ${
                    item.status !== "online" && "opacity-0"
                  }`}
                >
                  <span className="absolute inline-flex h-[5px] w-[5px] rounded-full bg-green-400 blur-sm"></span>
                  <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-green-500"></span>
                </span>
              </p>
              <span className="text-xs text-gray-500">
                {format(item.lastMessageDate, "EEEE")}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {item.lastMessage.slice(0, 35)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatRooms;
