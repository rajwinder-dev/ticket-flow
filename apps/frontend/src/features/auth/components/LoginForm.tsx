import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginInput, type LoginInput } from "@repo/schemas"; // Assuming loginInputSchema is the Zod schema
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMembersStore } from "@/features/members/store";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { refetch, isRefetching } = authClient.useSession();
  const { tokenEmail } = useMembersStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginInput.bodySchema),
    defaultValues: {
      email: tokenEmail || undefined,
    },
  });

  const onSubmit = async (input: LoginInput) => {
    await authClient.signIn.email(
      {
        email: input.email,
        password: input.password,
      },
      {
        onRequest: () => setIsLoggingIn(true),
        onResponse: () => refetch(),
        onSuccess: async () => {
          navigate("/org");
          setIsLoggingIn(false);
        },
        onError: (ctx) => {
          setIsLoggingIn(false);
          toast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />

                {errors.email && (
                  <FieldDescription className="text-red-500">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link to={"/forget-password"} className="ml-auto text-sm hover:underline">
                    Forgot your password?
                  </Link>
                </div>

                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="********"
                />

                {errors.password && (
                  <FieldDescription className="text-red-500">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>

              {/* SUBMIT */}
              <Field>
                <Button type="submit" disabled={isLoggingIn}>
                  Login
                </Button>

                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
