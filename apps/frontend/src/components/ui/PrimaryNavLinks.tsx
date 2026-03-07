import { useLocation } from "react-router";
import { directNvaLink, navLinkGroups } from "../../data/Links";
import { Link } from "react-router-dom";
interface props {
  currentSelection: number;
  setCurrantSelection: (x: number) => void;
}
function PrimaryNavLinks({ currentSelection, setCurrantSelection }: props) {
  const { pathname } = useLocation();

  return (
    <ul className="flex-1 overflow-y-auto border-b border-b-gray-200">
      {directNvaLink
        .filter((item) => item.type === "main")
        .map(({ href, label, icon }) => (
          <li key={href}>
            <Link
              to={href}
              onClick={() => setCurrantSelection(-1)}
              className={`hover:bg-blue/10 relative flex cursor-pointer gap-2 rounded-tr-lg rounded-br-lg px-4 py-3 transition-all ${
                pathname === href && currentSelection === -1 && "bg-blue2/10"
              }`}
            >
              <span
                className={`absolute top-0 left-0 h-full w-[4px] transition-all ${
                  pathname === href && currentSelection === -1 && "bg-blue-500"
                }`}
              />
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          </li>
        ))}
      {navLinkGroups.map(({ groupName, groupIcon, items }, i) => (
        <li key={groupName}>
          <button
            onClick={() => setCurrantSelection(i)}
            className={`hover:bg-blue/10 relative flex w-full cursor-pointer gap-2 rounded-tr-lg rounded-br-lg px-4 py-3 transition-all ${currentSelection === i && "bg-blue/10"}`}
          >
            <span
              className={`absolute top-0 left-0 h-full w-[4px] transition-all ${
                currentSelection === i && "bg-blue-500"
              }`}
            />
            <span>{groupIcon}</span>
            <span>{groupName}</span>
          </button>
          <ul
            className={`overflow-hidden transition-all duration-300 ease-in-out ${currentSelection === i ? "max-h-96" : "max-h-0"}`}
          >
            {items.map(({ href, icon, label }, i) => (
              <li key={`${href}${i}`}>
                <Link
                  key={href}
                  to={href}
                  className={`hover:bg-blue/10 relative ml-4 flex cursor-pointer gap-2 rounded-tr-lg rounded-br-lg px-4 py-3 transition-all ${
                    pathname === href ? "bg-blue2/10" : ""
                  }`}
                >
                  <span
                    className={`absolute top-0 left-0 h-full w-[4px] transition-all`}
                  />
                  <span>{icon}</span>
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default PrimaryNavLinks;
