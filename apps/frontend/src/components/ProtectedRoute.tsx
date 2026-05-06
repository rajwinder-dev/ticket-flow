import useAuth from "@/features/auth/hooks";
import { Navigate, Outlet } from "react-router";
import { Spinner } from "./ui/spinner";
import { useMembersStore } from "@/features/members/store";
const ProtectedRoute = () => {
  const { authDetails, isLoadingAuthDetails } = useAuth();
  const { tokenEmail, inviteToken } = useMembersStore();
  if (isLoadingAuthDetails)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  if (!authDetails) return <Navigate to="/login" />;

  // check if there is any invite pending
  if (inviteToken && tokenEmail === authDetails.data.email)
    return <Navigate to={`/invite-user/${inviteToken}`} />;
  return <Outlet />;
};

export default ProtectedRoute;
