import { useLocation } from "react-router";
import LogOutButton from "./LogOutButton";
import { Link } from "react-router-dom";
import { directNvaLink } from "../../data/Links";
interface props {
  setCurrantSelection: (x: number) => void;
}

function SecondaryNav({ setCurrantSelection }: props) {
  const { pathname } = useLocation();

  return (
    <ul className="border-t border-t-gray-200">
      {directNvaLink
        .filter((item) => item.type === "footer")
        .map(({ label, icon, href }) => (
          <Link
            key={href}
            to={href}
            onClick={() => setCurrantSelection(-1)}
            className={`hover:bg-blue/10 relative flex cursor-pointer gap-2 rounded-tr-lg rounded-br-lg px-4 py-3 transition-all ${
              pathname === href ? "bg-blue2/10" : ""
            }`}
          >
            <span
              className={`absolute top-0 left-0 h-full w-[4px] transition-all ${
                pathname === href ? "bg-blue-500" : ""
              }`}
            />
            <span>{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      <LogOutButton />
    </ul>
  );
}

export default SecondaryNav;
