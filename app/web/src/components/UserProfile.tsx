import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';
import { disconnectSocket } from '@/lib/socketIo';
import { Gear, LogoutIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useNavigate, useParams } from 'react-router';

import { useNotification } from '@org/core';
export function UserProfile() {
  const { orgId } = useParams();
  const { data: session } = authClient.useSession();
  useNotification({ userId: session?.user.id });
  const navigate = useNavigate();
  const handlerLogout = async () =>
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate('/');
          disconnectSocket();
        },
      },
    });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-secondary flex gap-2 rounded-md p-2">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage
            src={`${session?.user.image}`}
            alt={`${session?.user.name} Profile picture`}
          />
          <AvatarFallback className="rounded-lg uppercase">
            {session?.user.name[0] || 'P'}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{session?.user.name}</span>
          <span className="truncate text-xs">{session?.user.email}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={'bottom'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel
          className="cursor-pointer p-0 font-normal"
          onClick={() => navigate('/org')}
        >
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={`${session?.user.image}`}
                alt={`${session?.user.name} Profile picture`}
              />
              <AvatarFallback className="rounded-lg">
                {session?.user.name[0] || 'P'}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{session?.user.name}</span>
              <span className="truncate text-xs">{session?.user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate(`/org/${orgId}/setting`)}>
            <HugeiconsIcon icon={Gear} strokeWidth={2} />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlerLogout}>
          <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
