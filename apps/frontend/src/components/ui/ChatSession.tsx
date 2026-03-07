import {type Ref } from "react";
import { PieIcon } from "./Icons";

interface props {
  chatData: { turn: string; message: string; image?: string }[];
  isPending: boolean;
  ref: Ref<HTMLDivElement>;
}
function ChatSession({ chatData, isPending, ref }: props) {
  return (
    <div className="flex-1 overflow-y-auto px-4">
      {chatData.map((item, i) =>
        item.turn === "receiver" ? (
          <ReceiverMessage key={i} message={item.message} image={item.image} />
        ) : (
          <SenderMessage key={i} message={item.message} image={item.image} />
        )
      )}
      {isPending && <div className="loader p-4"></div>}
      <div ref={ref}></div>
    </div>
  );
}

export default ChatSession;

function SenderMessage({ message, image }: { message: string; image?: string }) {
  return (
    <div className="flex gap-4 py-4 justify-end items-end">
      <div className="px-4 py-2 rounded-md text-sm text-gray-800 bg-gary2 shadow-sm2 lg:max-w-1/2 border border-gray-200">
        <p className="text-gray-800">{message}</p>
      </div>
      <div className="shadow-md rounded-full h-12 w-12 flex items-center justify-center bg-lightWhite cursor-pointer overflow-hidden">
        <img src={image} className="fill" alt="image " />
      </div>
    </div>
  );
}
function ReceiverMessage({
  message,
  image,
}: {
  message: string;
  image?: string;
}) {
  return (
    <div className="flex gap-4 py-4">
      {!image && (
        <div className="shadow-md rounded-full h-12 w-12 flex items-center justify-center bg-lightWhite cursor-pointer">
          <PieIcon />
        </div>
      )}
      {image && (
        <div className="shadow-md rounded-full h-12 w-12 flex items-center justify-center bg-lightWhite cursor-pointer overflow-hidden">
          <img src={image} className="fill" alt="image " />
        </div>
      )}
      <div className="px-4 py-2 rounded-md text-sm text-gray-800 bg-gradient-to-r from-gradient1 to-gradient2 shadow-sm2 lg:max-w-1/2 border border-gray-200 flex items-center">
        <p className="text-gray-800">{message}</p>
      </div>
    </div>
  );
}
