import { PlusCircleIcon } from "../../../components/ui/Icons";
import SearchInput from "../../../components/ui/SearchInput";

const ChatRoomOptions = () => {
  return (
    <div className="flex items-center gap-4">
      <SearchInput placeholder="Search user" />
      <PlusCircleIcon />
    </div>
  );
};

export default ChatRoomOptions;
