import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useForm } from "react-hook-form";
import useAuth from "../hooks";

export function ForgetPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const { forgetPasswordMutate, isForgettingPassword } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    forgetPasswordMutate(data.email);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Forgot your password</CardTitle>
          <CardDescription>Enter your email to get a reset link</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* EMAIL */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>

                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  className={cn(errors.email && "border-red-500")}
                />

                {errors.email && (
                  <FieldDescription className="text-red-500">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>
              {/* SUBMIT */}
              <Field>
                <Button type="submit" disabled={isForgettingPassword}>
                  {isForgettingPassword ? "Sending..." : "Send Link"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
