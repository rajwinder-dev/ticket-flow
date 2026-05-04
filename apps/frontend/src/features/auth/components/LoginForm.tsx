import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginInput, type LoginInput } from "@repo/schemas"; // Assuming loginInputSchema is the Zod schema
import { useForm } from "react-hook-form";
import useAuth from "../hooks";
import { Link } from "react-router-dom";
import { useMembersStore } from "@/features/members/store";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { loginUser, isLoggingIn } = useAuth();
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

  const onSubmit = (data: LoginInput) => {
    loginUser(data);
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

                <Input id="password" type="password" {...register("password")} />

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
