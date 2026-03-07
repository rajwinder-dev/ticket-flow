import { useState } from "react";
import { Input } from "./Input";
import { SendIcon } from "./Icons";

interface props {
  handleMessage: (e: React.FormEvent<HTMLFormElement>) => void;
}
//  need modification for work batter
function SendButtonForm({ handleMessage }: props) {
  const [message, setMessage] = useState("");
  const isPending = false;
  function handleSubmit<T extends HTMLFormElement>(
    e: React.FormEvent<T>,
    handler: (e: React.FormEvent<T>) => void
  ): void {
    e.preventDefault();
    handler(e);
  }

  return (
    <form className="relative" onSubmit={(e) => handleSubmit(e, handleMessage)}>
      <Input
        type="text"
        placeholder="Send message"
        className="bg-gray-100 px-2 py-4 border-none shadow-inner placeholder-gray-500"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        disabled={isPending}
      />
      <button className="absolute right-2 top-2" type="submit">
        <SendIcon />
      </button>
    </form>
  );
}

export default SendButtonForm;
