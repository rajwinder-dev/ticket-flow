import SendButtonForm from "../../../components/ui/SendButtonForm";
import ReceiverMessage from "./ReceiveMessage";
import SenderMessage from "./SenderMessage";
const messages = [
  {
    id: 1,
    message: "Hello , how things are going ",
    readAT: null,
    isRead: false,
    senderId: 3,
    isDelivered: true,
  },
  {
    id: 2,
    message: "Working on it ",
    readAT: null,
    isRead: false,
    senderId: 2,
    isDelivered: true,
  },
  {
    id: 3,
    message: "Send me reports  ",
    readAT: null,
    isRead: false,
    senderId: 3,
    isDelivered: true,
  },
  {
    id: 4,
    message: "Ok sir i will whats app  ",
    readAT: null,
    isRead: false,
    senderId: 2,
    isDelivered: true,
  },
  {
    id: 5,
    message: "ok ",
    readAT: null,
    isRead: false,
    senderId: 3,
    isDelivered: true,
  },
];
const ChatSession = () => {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Chat messages (scrollable area) */}
      <div className="flex-1 overflow-auto p-2">
        {messages.map((item) => {
          if (item.senderId === 2)
            return <SenderMessage message={item.message} />;
          else return <ReceiverMessage message={item.message} />;
        })}
      </div>

      {/* Send message input (sticks at bottom) */}
      <div className="shrink-0 p-2">
        <SendButtonForm handleMessage={() => {}} />
      </div>
    </div>
  );
};

export default ChatSession;
