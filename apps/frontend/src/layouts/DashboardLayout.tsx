import { Outlet } from "react-router";
import Header from "../components/ui/Header";
import SideNav from "../components/ui/SideNav";

function DashboardLayout() {
  return (
    <div className="grid h-screen grid-cols-[auto_1fr] grid-rows-[auto_1fr] overflow-hidden">
      <div className="bg-lightWhite3 rounded-tr-2xl border-r border-r-gray-200"></div>
      <Header />
      <SideNav />
      <div className="relative h-[90vh] overflow-hidden">
        <main className="h-[90vh] overflow-auto px-8 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
