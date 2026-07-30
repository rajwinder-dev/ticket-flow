import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Outlet, useParams } from 'react-router';
import { useOrgPrefetch } from '@/hooks/usePrefetch';

export default function DashboardLayout() {
  const { orgId } = useParams();
  useOrgPrefetch();
  return (
    <SidebarProvider>
      {orgId && <AppSidebar />}
      <SidebarInset>
        <AppHeader />
        <div className="flex max-h-[calc(100vh-4rem)] w-full flex-1 flex-col overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
