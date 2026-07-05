import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordInput, type ChangePasswordInput } from "@org/zod";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

const ChangePasswordForm = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordInput.bodySchema),
  });

  // 3. Handle submission
  const onSubmit = async (data: ChangePasswordInput) => {
    await authClient.changePassword(
      {
        newPassword: data.password,
        currentPassword: data.currentPassword,
        revokeOtherSessions: true,
      },
      {
        onRequest: () => setIsChangingPassword(true),
        onSuccess: () => {
          setIsChangingPassword(false);
          reset();
        },
        onError: (csx) => {
          setIsChangingPassword(false);
          toast.error(csx.error.message);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Change your password and manage 2FA settings.</CardDescription>
        </CardHeader>
        {/* Wrap content in a form tag */}
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">Current Password</Label>
            <Input id="current" type="password" {...register("currentPassword")} />
            {errors.currentPassword && (
              <p className="text-destructive text-sm">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-destructive text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">confirmPassword Password</Label>
            <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isChangingPassword}>
            {isChangingPassword ? "Saving..." : "Save password"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ChangePasswordForm;
