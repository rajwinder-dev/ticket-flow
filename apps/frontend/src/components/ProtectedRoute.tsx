import { Navigate, Outlet } from "react-router";
import { Spinner } from "./ui/spinner";
import { useMembersStore } from "@/features/members/store";
import { authClient } from "@/lib/auth-client";
const ProtectedRoute = () => {
  const { data: session, isPending } = authClient.useSession();
  const { tokenEmail, inviteToken } = useMembersStore();
  if (isPending)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  if (!session) return <Navigate to="/login" />;

  // check if there is any invite pending
  if (inviteToken && tokenEmail === session?.user.email)
    return <Navigate to={`/invite-user/${inviteToken}`} />;
  return <Outlet />;
};

export default ProtectedRoute;
