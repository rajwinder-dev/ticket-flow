import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Server } from "lucide-react";
import { useForm } from "react-hook-form";

// 1. Define the SMTP validation schema

const SmtpFallbackForm = () => {
  // 2. Initialize the form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
    },
  });

  const onSubmit = (data) => {
    console.log("SMTP Config:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-muted-foreground flex items-center gap-2 text-lg">
            <Server className="h-5 w-5" />
            SMTP Fallback
          </CardTitle>
          <CardDescription className="flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            Used if the primary provider fails.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Host and Port Row */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input id="smtpHost" placeholder="smtp.mailtrap.io" {...register("smtpHost")} />
              {errors.smtpHost && (
                <p className="text-destructive text-xs">{errors.smtpHost.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">Port</Label>
              <Input id="smtpPort" type="number" placeholder="587" {...register("smtpPort")} />
              {errors.smtpPort && (
                <p className="text-destructive text-xs">{errors.smtpPort.message}</p>
              )}
            </div>
          </div>

          {/* Credentials Row */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtpUser">Username</Label>
              <Input id="smtpUser" placeholder="user@example.com" {...register("smtpUser")} />
              {errors.smtpUser && (
                <p className="text-destructive text-xs">{errors.smtpUser.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPass">Password</Label>
              <Input
                id="smtpPass"
                type="password"
                placeholder="••••••••"
                {...register("smtpPassword")}
              />
              {errors.smtpPassword && (
                <p className="text-destructive text-xs">{errors.smtpPassword.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" variant="secondary" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Test & Save Fallback
        </Button>
      </div>
    </form>
  );
};

export default SmtpFallbackForm;
