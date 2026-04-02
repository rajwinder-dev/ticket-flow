import useAuth from "@/features/auth/hooks";
import { Navigate, Outlet } from "react-router";
import { Spinner } from "./ui/spinner";
const ProtectedRoute = () => {
  const { authDetails, isLoadingAuthDetails } = useAuth();
  if (isLoadingAuthDetails)
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <Spinner className="size-8"/>
      </div>
    );
  if (!authDetails) return <Navigate to="/login" />;
  return <Outlet />;
};

export default ProtectedRoute;
