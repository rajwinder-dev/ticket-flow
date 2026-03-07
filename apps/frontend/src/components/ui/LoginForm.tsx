import { useState } from "react";
import { Input } from "./Input";
import CheckBox from "./CheckBox";
import { PrimaryButton } from "./PrimaryButton";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

function LoginForm() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false); // Added Remember Me state
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ username: string; password: string }>();
  const { loginUser, isLoggingIn } = useAuth();

  async function handleSignIn(data: { username: string; password: string }) {
    setError("");
    loginUser(data, {
      onSuccess: () => {
        reset();
        navigate("/");
      },
    });
  }

  return (
    <form
      action=""
      className="flex flex-col gap-8"
      onSubmit={handleSubmit(handleSignIn)}
    >
      <div className="relative">
        <label>Username</label>
        <Input
          type="text"
          placeholder="rabat1234"
          defaultValue="rajwinder"
          disabled={isLoggingIn}
          {...register("username", {
            required: "username is required",
          })}
        />
        {errors.username && (
          <p className="absolute text-sm text-red-400">
            {errors.username.message as string}
          </p>
        )}
      </div>
      <div>
        <label>password</label>
        <Input
          type="password"
          placeholder="Enter password"
          defaultValue="user"
          disabled={isLoggingIn}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 4,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <p className="absolute text-sm text-red-400">
            {errors.password.message as string}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <CheckBox
          label="Remember Me"
          checked={rememberMe}
          onChange={() => setRememberMe((prev) => !prev)} // Toggle Remember Me
          disabled={isLoggingIn}
        />

        <a href="#">Forget Password</a>
      </div>
      {error && <p className="text-center text-red-400">{error}</p>}
      <PrimaryButton
        type="submit"
        disabled={isLoggingIn}
        className="flex justify-center"
      >
        {isLoggingIn ? <div className="loader"></div> : "Login"}
      </PrimaryButton>
    </form>
  );
}

export default LoginForm;
