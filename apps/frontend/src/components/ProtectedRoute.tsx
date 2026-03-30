import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";
interface props {
  children: ReactNode;
}
const ProtectedRoute = ({ children }: props) => {
  const { isLoggedIn, isFetchingRole } = useAuth();
  if (isFetchingRole) return <div>Loading</div>;
  if (!isLoggedIn && !isFetchingRole) return <Navigate to="/login" />;
  return <>{children}</>;
};

export default ProtectedRoute;
