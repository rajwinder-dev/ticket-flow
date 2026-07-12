"use client";

import { NavMain } from "@/components/nav-main";
import { OrganizationSwitcher } from "@/components/OrganizationSwitcher";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import {
  Activity01Icon,
  CustomerSupportIcon,
  DashboardSquare01Icon,
  SecurityLockIcon,
  Settings05Icon,
  Ticket01Icon,
  UserGroupIcon,
  WorkflowCircle01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
const navMainItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />,
  },
  {
    title: "Tickets",
    url: "/tickets",
    icon: <HugeiconsIcon icon={Ticket01Icon} strokeWidth={2} />,
    isActive: true,
    items: [
      {
        title: "All Tickets",
        url: "/ticket",
      },
      {
        title: "My Tickets",
        url: "/ticket?assignedTo=mine",
      },
      {
        title: "Unassigned",
        url: "/ticket?assignedTo=none",
      },
    ],
  },
  {
    title: "Queues & Groups",
    url: "/queue",
    icon: <HugeiconsIcon icon={WorkflowCircle01Icon} strokeWidth={2} />,
  },
  {
    title: "Members",
    url: "/member",
    icon: <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />,
  },
  {
    title: "Customers",
    url: "/customer",
    icon: <HugeiconsIcon icon={CustomerSupportIcon} strokeWidth={2} />,
  },
  {
    title: "Roles & Permissions",
    url: "/rbac",
    icon: <HugeiconsIcon icon={SecurityLockIcon} strokeWidth={2} />,
  },
  {
    title: "Activity Logs",
    url: "/activity",
    icon: <HugeiconsIcon icon={Activity01Icon} strokeWidth={2} />,
  },
  {
    title: "Settings",
    url: "/setting",
    icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
