import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router";

export default function DashboardLayout() {
  const location = useLocation();
  const showSidebar = location.pathname !== "/dashboard/organization";

  return (
    <SidebarProvider>
      {showSidebar && <AppSidebar />}
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
