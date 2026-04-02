import { tokenManager } from "@/lib/tokenManager";
import type { ChangePasswordInput, LoginInput, ResetPasswordInput, SignupInput } from "@repo/schemas";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { changePassword, forgetPassword, gatAuthDetails, login, logOut, resetPassword, signUp } from "./api";

function useAuth() {
  const navigate = useNavigate();
  const { data: authDetails, isLoading: isLoadingAuthDetails } = useQuery({
    queryFn: gatAuthDetails,
    queryKey: ["auth-details"],
    retry:false
  });
  const { mutate: loginUser, isPending: isLoggingIn } = useMutation({
    mutationFn: (data: LoginInput) => login(data),
    onSuccess: (data) => {
      tokenManager.set(data.data.accessToken);
      navigate("/org");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: signupUser, isPending: isSigningUp } = useMutation({
    mutationFn: (data: SignupInput) => signUp(data),
    onSuccess: (data) => {
      tokenManager.set(data.data.accessToken);
      navigate("/org");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: forgetPasswordMutate, isPending: isForgettingPassword } = useMutation({
    mutationFn: (email: string) => forgetPassword(email),
    onSuccess: (data) => {
      console.log(data)
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: resetPasswordMutate, isPending: isResettingPassword } = useMutation({
    mutationFn: ({token, input}: {token: string, input: ResetPasswordInput}) => resetPassword({token, input}),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: changePasswordMutate, isPending: isChangingPassword } = useMutation({
    mutationFn: (data: ChangePasswordInput) => changePassword(data),
    onSuccess: (data) => {
      toast.success(data.message);
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
    signupUser,
    forgetPasswordMutate,
    isForgettingPassword,
    resetPasswordMutate,
    isResettingPassword,
    changePasswordMutate,
    isChangingPassword,
    isSigningUp,
    isLoggingOut,
    isLoggingIn,
    authDetails,
    isLoadingAuthDetails,
  };
}

export default useAuth;
