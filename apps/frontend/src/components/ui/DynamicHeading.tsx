import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { navLinks } from "../../data/Links";
import { matchPath } from "react-router";
function DynamicHeading() {
  const { pathname } = useLocation();
  const [heading, setHeading] = useState("");

  useEffect(() => {
    setHeading(matchNavLabel(pathname));
  }, [pathname]);

  return <h1 className="text-gray1 text-2xl">{heading}</h1>;
}

export default DynamicHeading;

function matchNavLabel(pathname: string): string {
  for (const { href, label } of navLinks) {
    if (matchPath({ path: href, end: true }, pathname)) return label;
  }

  return ""; // fallback
}
