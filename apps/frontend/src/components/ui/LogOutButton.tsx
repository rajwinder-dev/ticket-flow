import { useAuth } from "../../context/AuthContext";
import { SignoutIcons } from "./Icons";

function LogOutButton() {
  const { logoutUser } = useAuth();
  return (
    <button
      onClick={logoutUser}
      className="hover:bg-blue/10 relative flex w-full cursor-pointer gap-2 rounded-tr-lg rounded-br-lg px-4 py-3 transition-all"
    >
      <span className="absolute top-0 left-0 h-full w-[4px]" />
      <span>{<SignoutIcons />}</span>
      <span>{"signout"}</span>
    </button>
  );
}

export default LogOutButton;
