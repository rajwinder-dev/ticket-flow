import type {
  ChangePasswordInput,
  LoginInput,
  ResetPasswordInput,
  SignupInput,
} from "@org/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { authApi } from "./api.js";

export const useAuth = () => {
  const navigate = useNavigate();
  const { data: authDetails, isLoading: isLoadingAuthDetails } = useQuery({
    queryFn: authApi.getDetails,
    queryKey: ["auth-details"],
    retry: false,
  });
  const { mutate: loginUser, isPending: isLoggingIn } = useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: () => {
      navigate("/org");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: signupUser, isPending: isSigningUp } = useMutation({
    mutationFn: (data: SignupInput) => authApi.signUp(data),
    onSuccess: () => {
      navigate("/org");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: forgetPasswordMutate, isPending: isForgettingPassword } = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: resetPasswordMutate, isPending: isResettingPassword } = useMutation({
    mutationFn: ({ token, input }: { token: string; input: ResetPasswordInput }) =>
      authApi.resetPassword({ token, input }),
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: changePasswordMutate, isPending: isChangingPassword } = useMutation({
    mutationFn: (data: ChangePasswordInput) => authApi.changePassword(data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: logoutUser, isPending: isLoggingOut } = useMutation({
    mutationFn: authApi.logout,
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

