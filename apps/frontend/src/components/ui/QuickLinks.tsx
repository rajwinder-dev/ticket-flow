import React from "react";
import { SecondaryButton } from "./SecondaryButton";
import { Link } from "react-router-dom";

interface props {
  quickLinks: {
    icon: React.ReactNode;
    label: string;
    href?: string;
  }[];
}
function QuickLinks({ quickLinks }: props) {
  return (
    <div className="py-2">
      <hr className="text-gray-300" />
      <h3 className="text-md font-semibold py-2">Quick Links</h3>
      <div className="flex gap-4 justify-start flex-wrap">
        {quickLinks.map((link) =>
          link.href ? (
            <Link key={link.label} to={link.href}>
              <SecondaryButton className="rounded-lg w-64 uppercase flex justify-center items-center gap-4">
                {link.icon}
                <span>{link.label}</span>
              </SecondaryButton>
            </Link>
          ) : (
            <SecondaryButton
              key={link.label}
              className="rounded-lg w-full max-w-64 uppercase flex justify-center items-center gap-4"
            >
              {link.icon}
              <span>{link.label}</span>
            </SecondaryButton>
          )
        )}
      </div>
    </div>
  );
}

export default QuickLinks;
