import { login, logOut, tokenManager } from "../actions/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

// import { useNavigate } from 'react-router-dom';

function useAuthentication() {
  const navigate = useNavigate();
  const { mutate: loginUser, isPending: isLoggingIn } = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => login({ username, password }),
    onSuccess: (data) => {
      tokenManager.set(data.accessToken);
      navigate("/");
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

export default useAuthentication;
