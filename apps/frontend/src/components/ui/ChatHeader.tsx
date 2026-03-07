import { PieIcon, ResetIcon } from "./Icons";

function ChatHeader() {
  return (
    <>
      <div className="flex justify-between gap-4 items-center pb-4">
        <div className="flex gap-4 items-center">
          <PieIcon />
          <h2 className="text-xl font-semibold">AI Agent</h2>
        </div>
        <button className="flex gap-4 cursor-pointer">
          <ResetIcon />
          <span>Reset</span>
        </button>
      </div>{" "}
      <hr className="text-gray-300 " />
    </>
  );
}

export default ChatHeader;
