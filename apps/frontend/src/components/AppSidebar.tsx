"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { OrganizationSwitcher } from "@/components/OrganizationSwitcher";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import {
  HomeIcon,
  Layers01Icon,
  Settings05Icon,
  Ticket01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
const navMainItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: <HugeiconsIcon icon={HomeIcon} strokeWidth={2} />,
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
        url: "/ticket?filter=my",
      },
      {
        title: "Unassigned",
        url: "/ticket?filter=unassigned",
      },
      {
        title: "Closed",
        url: "/ticket?status=closed",
      },
    ],
  },
  {
    title: "Queues",
    url: "/queue",
    icon: <HugeiconsIcon icon={Layers01Icon} strokeWidth={2} />,
    items: [
      {
        title: "All Queues",
        url: "/queue",
      },
      {
        title: "Queue Groups",
        url: "/queue-group",
      },
    ],
  },
  {
    title: "Members",
    url: "/member",
    icon: <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />,
  },
  {
    title: "Settings",
    url: "/setting",
    icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
    items: [
      {
        title: "General",
        url: "/setting",
      },
      {
        title: "Roles & Permissions",
        url: "/setting/rbac",
      },
    ],
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
