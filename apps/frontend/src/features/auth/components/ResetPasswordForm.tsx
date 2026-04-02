import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorState from "@/components/ui/errorState";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordInput, type ResetPasswordInput } from "@repo/schemas";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { authApi } from "../api";
import useAuth from "../hooks";

export function ResetpasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const { token } = useParams();
  const navigate = useNavigate();
  const { error } = useQuery({
    queryFn: () => authApi.tokenDetails(token!),
    queryKey: ["tokenDetails"],
    enabled: !!token,
    retry: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordInput.bodySchema),
  });
  const { resetPasswordMutate, isResettingPassword } = useAuth();
  const onSubmit = (data: ResetPasswordInput) => {
    if (!token) return toast.error("token not found");
    resetPasswordMutate({ token, input: data });
  };
  if (error) {
    return (
      <ErrorState
        title="Link expired"
        message="This password reset link is invalid or has expired."
        buttonText="Request new link"
        onAction={() => navigate("/forget-password")}
      />
    );
  }
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
