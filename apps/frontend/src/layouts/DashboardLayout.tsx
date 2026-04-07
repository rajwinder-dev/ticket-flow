import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router";

export default function DashboardLayout() {
  const location = useLocation();
  const showSidebar = location.pathname !== "/org";

  return (
    <SidebarProvider>
      {showSidebar && <AppSidebar />}
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4  overflow-auto max-h-[calc(100vh-4rem)]">

          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
