import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Spinner from "./ui/Spinner";
import type { ReactNode } from "react";
interface props {
  children: ReactNode;
}
const ProtectedRoute = ({ children }: props) => {
  const { isLoggedIn, isFetchingRole } = useAuth();
  if (isFetchingRole) return <Spinner />;
  if (!isLoggedIn && !isFetchingRole) return <Navigate to="/login" />;
  return <>{children}</>;
};

export default ProtectedRoute;
