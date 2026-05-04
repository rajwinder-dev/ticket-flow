import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ErrorState from "@/components/ui/errorState";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate, useParams } from "react-router";
import useMember from "../hooks";
import { useEffect } from "react";
import { useMembersStore } from "../store";
import useAuth from "@/features/auth/hooks";

const InviteMemberPage = () => {
  const { token } = useParams();
  const { authDetails, isLoadingAuthDetails } = useAuth();
  const { setInviteToken, clearInvite } = useMembersStore();

  const { inviteDetails, isLoadingInviteDetails, acceptInviteMutate, InviteError } = useMember();
  useEffect(() => {
    if (token && inviteDetails?.data.invitedTo) {
      console.log("tocket details updated");
      setInviteToken({ token, email: inviteDetails?.data.invitedTo });
    }
  }, [token, setInviteToken, inviteDetails]);
  const navigate = useNavigate();
  const inviteData = inviteDetails?.data;

  const handleInvite = () => {
    acceptInviteMutate(token!, {
      onSuccess: (data) => {
        clearInvite();
        navigate(`/org/${data.data.organizationId}`);
      },
    });
  };
  const handleDecline = () => {
    clearInvite();
    navigate(`/`);
  };
  if (isLoadingInviteDetails || isLoadingAuthDetails) return <Spinner />;
  if (InviteError) return <ErrorState message={InviteError.message} onAction={handleDecline} />;
  if (authDetails?.data.email !== inviteDetails?.data.invitedTo) navigate("/login");
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
          <div className="grid grid-cols-2 gap-3 text-sm">
            <p className="text-muted-foreground">Organization</p>
            <p className="text-right font-medium">{inviteData?.organization}</p>

            <p className="text-muted-foreground">Role</p>
            <p className="text-right">
              <Badge variant="outline">{inviteData?.role}</Badge>
            </p>

            <p className="text-muted-foreground">Invited To</p>
            <p className="text-right font-medium">{inviteData?.invitedTo}</p>

            <p className="text-muted-foreground">Invited By</p>
            <p className="text-right font-medium">{inviteData?.invitedBy}</p>

            <p className="text-muted-foreground">Expires At</p>
            <p className="text-right font-medium">
              {inviteData?.expiresAt && new Date(inviteData.expiresAt).toLocaleString()}
            </p>
          </div>

          <Separator />

          <div className="text-muted-foreground text-xs">
            Invite token: <span className="text-foreground font-medium">{token}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleDecline}>
            Cancel
          </Button>
          <Button onClick={handleInvite}>Accept Invite</Button>{" "}
        </CardFooter>{" "}
      </Card>{" "}
    </div>
  );
};
export default InviteMemberPage;
