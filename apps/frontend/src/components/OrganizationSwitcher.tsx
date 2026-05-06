"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useOrganizations from "@/features/organization/hooks";
import { PlusSignIcon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function OrganizationSwitcher() {
  const { isMobile } = useSidebar();
  const { organizations } = useOrganizations();
  const { orgId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChangeOrg = (orgId: string) =>
    navigate(`/org/${orgId}/${location.pathname.split("/").slice(3).join("/")}`);
  const activeOrganization = organizations?.data.find((item) => item.id === orgId);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border-border border"
            >
              {activeOrganization ? (
                <>
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={activeOrganization?.logo} alt="org logo" />
                    <AvatarFallback>
                      {activeOrganization?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{activeOrganization?.name}</span>
                    <span className="truncate text-xs capitalize">
                      {activeOrganization.role.toLocaleLowerCase()}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-accent text-lg">Select Organization </div>
              )}
              <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>
            {organizations?.data.map((org, index) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleChangeOrg(org.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={`${org.logo}`} alt={`${org.name} Logo`}></AvatarImage>
                    <AvatarFallback>{org.name[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {/* {org.logo} */}
                </div>
                {org.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={() => navigate("/org/new")}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Create organization</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
