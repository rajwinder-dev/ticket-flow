import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ErrorState from '@/components/ui/errorState';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton'; // Import shadcn skeleton
import { useNavigate, useParams } from 'react-router';

import { useMember, useMembersStore } from '@org/core';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

const InviteMemberPage = () => {
  const { token, orgId } = useParams();
  const { data: session, isPending } = authClient.useSession();
  const { setInviteToken, clearInvite } = useMembersStore();
  const navigate = useNavigate();

  const {
    inviteDetails,
    isLoadingInviteDetails,
    acceptInviteMutate,
    InviteError,
  } = useMember({ orgId, token });
  const inviteData = inviteDetails?.data;
  const isLoading = isLoadingInviteDetails || isPending;

  useEffect(() => {
    if (token && inviteDetails?.data.invitedTo) {
      console.log('ticket details updated');
      setInviteToken({ token, email: inviteDetails?.data.invitedTo });
    }
  }, [token, setInviteToken, inviteDetails]);

  // Safe client redirect guard inside a standard hook cycle
  useEffect(() => {
    if (!isLoading && !InviteError) {
      if (session?.user.email !== inviteDetails?.data.invitedTo) {
        navigate('/login');
      }
    }
  }, [session, inviteDetails, isLoading, InviteError, navigate]);

  const handleInvite = () => {
    acceptInviteMutate(token!, {
      onSuccess: (data) => {
        clearInvite();
        toast.success('organization joined  successfully');
        navigate(`/org/${data.data.organizationId}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const handleDecline = () => {
    clearInvite();
    navigate(`/`);
  };

  if (InviteError)
    return (
      <ErrorState message={InviteError.message} onAction={handleDecline} />
    );

  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-2">
          <Badge variant="secondary" className="w-fit">
            Organization Invite
          </Badge>
          <CardTitle>Accept or Decline Invitation</CardTitle>
          <CardDescription>
            You have been invited to join an organization workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 items-center gap-x-3 gap-y-4 text-sm">
            {/* Organization Row */}
            <p className="text-muted-foreground">Organization</p>
            {isLoading ? (
              <Skeleton className="h-4 w-32 justify-self-end" />
            ) : (
              <p className="text-right font-medium">
                {inviteData?.organization}
              </p>
            )}

            {/* Role Row */}
            <p className="text-muted-foreground">Role</p>
            {isLoading ? (
              <Skeleton className="h-5 w-16 justify-self-end rounded-md" />
            ) : (
              <p className="text-right">
                <Badge variant="outline">{inviteData?.role}</Badge>
              </p>
            )}

            {/* Invited To Row */}
            <p className="text-muted-foreground">Invited To</p>
            {isLoading ? (
              <Skeleton className="h-4 w-44 justify-self-end" />
            ) : (
              <p className="text-right font-medium">{inviteData?.invitedTo}</p>
            )}

            {/* Invited By Row */}
            <p className="text-muted-foreground">Invited By</p>
            {isLoading ? (
              <Skeleton className="h-4 w-28 justify-self-end" />
            ) : (
              <p className="text-right font-medium">{inviteData?.invitedBy}</p>
            )}

            {/* Expires At Row */}
            <p className="text-muted-foreground">Expires At</p>
            {isLoading ? (
              <Skeleton className="h-4 w-36 justify-self-end" />
            ) : (
              <p className="text-right font-medium">
                {inviteData?.expiresAt &&
                  new Date(inviteData.expiresAt).toLocaleString()}
              </p>
            )}
          </div>

          <Separator />

          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <span>Invite token:</span>
            {isLoading ? (
              <Skeleton className="h-3 w-48" />
            ) : (
              <span className="text-foreground font-mono font-medium">
                {token}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleDecline}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={isLoading}>
            Accept Invite
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InviteMemberPage;
