import { Outlet, useLocation, useNavigate } from "react-router";
import { Spinner } from "./ui/spinner";
import { useMembersStore } from "@org/core";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { data: session, isPending} = authClient.useSession();
  console.log(session, isPending, )
  const { tokenEmail, inviteToken } = useMembersStore();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isPending) return;

    // unauthenticated
    if (!session) {
      navigate("/login", {
        replace: true,
        state: {
          from: location.pathname,
        },
      });

      return;
    }

    // invite redirect
    if (inviteToken && tokenEmail === session.user.email) {
      navigate(`/invite-user/${inviteToken}`, {
        replace: true,
      });
    }
  }, [session, isPending, navigate, location, inviteToken, tokenEmail]);

  if (isPending || session === undefined) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!session) return null;

  return <Outlet />;
};

export default ProtectedRoute;
