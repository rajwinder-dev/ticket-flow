import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import useAuth from "@/features/auth/hooks";
import useUser from "@/features/users/hooks";
import { Gear, LogoutIcon,  } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate, useParams } from "react-router";

export function UserProfile() {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const { userDetails } = useUser();
  const { logoutUser } = useAuth();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={`${userDetails?.data.avatar}`}
                  alt={`${userDetails?.data.username} Profile picture`}
                />
                <AvatarFallback className="rounded-lg">
                  {userDetails?.data.username?.[0] || "P"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userDetails?.data.username}</span>
                <span className="truncate text-xs">{userDetails?.data.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={"bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={`${userDetails?.data.avatar}`}
                    alt={`${userDetails?.data.username} Profile picture`}
                  />
                  <AvatarFallback className="rounded-lg">
                    {userDetails?.data.username?.[0] || "P"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userDetails?.data.username}</span>
                  <span className="truncate text-xs">{userDetails?.data.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* <DropdownMenuItem> */}
              {/* <HugeiconsIcon icon={NotificationIcon} strokeWidth={2} /> */}
              {/* Notifications */}
              {/* </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => navigate(`/org/${orgId}/setting`)}>
                <HugeiconsIcon icon={Gear} strokeWidth={2} />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logoutUser()}>
              <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
