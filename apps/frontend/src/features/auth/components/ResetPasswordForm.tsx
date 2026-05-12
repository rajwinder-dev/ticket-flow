import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordInput, type ResetPasswordInput } from "@repo/schemas";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export function ResetpasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const { token } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordInput.bodySchema),
  });
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) return toast.error("token not found");
    await authClient.resetPassword(
      {
        newPassword: data.password,
        token,
      },
      {
        onRequest: () => setIsResettingPassword(true),
        onError: (ctx) => {
          setIsResettingPassword(false);
          toast.error(ctx.error.messsage);
          reset();
        },
        onSuccess: () => {
          setIsResettingPassword(false);
          reset();
          toast.success("Password updated successfully");
          navigate("/login");
        },
      },
    );
  };
  // if (error) {
  //   return (
  //     <ErrorState
  //       title="Link expired"
  //       message="This password reset link is invalid or has expired."
  //       buttonText="Request new link"
  //       onAction={() => navigate("/forget-password")}
  //     />
  //   );
  // }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="*******"
                  {...register("password")}
                />
                {errors.password && (
                  <FieldDescription className="text-red-500">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="*******"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <FieldDescription className="text-red-500">
                    {errors.confirmPassword.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isResettingPassword}>
                  Reset password
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
