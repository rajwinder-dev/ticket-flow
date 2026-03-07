"use client";
import DynamicHeading from "./DynamicHeading";
import UserProfile from "./UserProfile";

function Header() {
  return (
    <header className="col-start-2 border-b border-b-gray-200">
      <nav className="flex items-center justify-between px-8 py-4">
        <DynamicHeading />
        <UserProfile />
      </nav>
    </header>
  );
}

export default Header;
