import ChatHeader from "./ChatHeader";
import ChatSession from "./ChatSession";

const ChatArea = () => {
  return (
    <div className="col-start-2 row-span-2 row-start-1 overflow-hidden">
      <div className="flex h-full flex-col">
        <ChatHeader />
        <ChatSession />
      </div>
    </div>
  );
};

export default ChatArea;
