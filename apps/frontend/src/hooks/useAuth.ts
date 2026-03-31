import type { LoginInput } from "@repo/schemas";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { login, logOut, tokenManager } from "../api/auth.api";
function useAuth() {
  const navigate = useNavigate();
  const { mutate: loginUser, isPending: isLoggingIn } = useMutation({
    mutationFn: (data: LoginInput) => login(data),
    onSuccess: (data) => {
      tokenManager.set(data.accessToken);
      navigate("/dashboard/organization");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: logoutUser, isPending: isLoggingOut } = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      navigate("/login");
    },
    onError: () => {
      toast.error("something went wrong ");
    },
  });
  return {
    loginUser,
    logoutUser,
    isLoggingOut,
    isLoggingIn,
  };
}

export default useAuth;
