import { useMemo, useState } from "react";
import PrimaryNavLinks from "./PrimaryNavLinks";
import SecondaryNav from "./SecondaryNav";
import { navLinkGroups } from "../../data/Links";
import { useLocation } from "react-router";

function SideNav() {
  const { pathname } = useLocation();
  const initialIndex = useMemo(() => {
    return navLinkGroups.findIndex((group) =>
      group.items.some((item) => item.href === pathname),
    );
  }, [pathname]);
  const [currentSelection, setCurrantSelection] = useState(initialIndex);
  return (
    <nav className="bg-lightWhite3 text-blue2 row-start-2 flex h-[91vh] flex-col justify-between border-r border-r-gray-200 py-8 pr-2">
      <PrimaryNavLinks
        currentSelection={currentSelection}
        setCurrantSelection={setCurrantSelection}
      />
      <SecondaryNav setCurrantSelection={setCurrantSelection} />
    </nav>
  );
}

export default SideNav;
