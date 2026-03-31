import React, { createContext, useContext } from "react";
import useAuthentication from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import type { myAssignRole } from "../types/roleAssignTypes";

interface AuthContextType {
  loginUser: (
    data: { username: string; password: string },
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    },
  ) => void;
  logoutUser: () => void;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  userRole: myAssignRole | undefined;
  isFetchingRole: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { loginUser, logoutUser, isLoggingIn, isLoggingOut } =
    useAuthentication();
  const { userRole, isFetchingRole , isLoggedIn} = useRole();
  return (
    <AuthContext.Provider
      value={{
        loginUser,
        logoutUser,
        isLoggingIn,
        isLoggingOut,
        userRole,
        isLoggedIn,
        isFetchingRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
