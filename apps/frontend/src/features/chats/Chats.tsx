
import ChatRooms from "./components/ChatRooms";
import ChatRoomOptions from "./components/ChatRoomOptions";
import ChatArea from "./components/ChatArea";

const users = [
  {
    id: "u1",
    name: "Alice Johnson",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    lastMessage:
      "Hey! Just wanted to check in and see how everything’s going on your side. 😊",
    lastMessageDate: "2025-06-22T14:35:00Z",
    status: "online",
  },
  {
    id: "u2",
    name: "Bob Smith",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    lastMessage:
      "I’ve uploaded the project files to the shared drive. Let me know if you need help with anything else.",
    lastMessageDate: "2025-06-21T09:12:00Z",
    status: "offline",
  },
  {
    id: "u3",
    name: "Clara Lopez",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    lastMessage:
      "Let’s plan for a quick sync tomorrow afternoon, maybe around 3PM your time?",
    lastMessageDate: "2025-06-22T20:02:00Z",
    status: "online",
  },
  {
    id: "u4",
    name: "Daniel Wu",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    lastMessage:
      "Don’t forget the client meeting tomorrow — I’ll share the notes by tonight.",
    lastMessageDate: "2025-06-20T18:44:00Z",
    status: "offline",
  },
  {
    id: "u5",
    name: "Eva Green",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    lastMessage:
      "Thanks for your help today, really appreciated it. Let’s catch up next week?",
    lastMessageDate: "2025-06-19T16:10:00Z",
    status: "offline",
  },
  {
    id: "u5",
    name: "Eva Green",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    lastMessage:
      "Thanks for your help today, really appreciated it. Let’s catch up next week?",
    lastMessageDate: "2025-06-19T16:10:00Z",
    status: "offline",
  },
];

const Chats = () => {
  return (
    <div className="grid h-[85vh] grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-4 bg-white p-4">
      <ChatRoomOptions />
      <ChatRooms users={users} />
      <ChatArea />
    </div>
  );
};

export default Chats;
