"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateSmtpInput } from "@repo/schemas";
import { AlertCircle, Loader2, Mail, Server } from "lucide-react";
import { useForm } from "react-hook-form";
import useEmail from "../hooks";

type SmtpFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  // providerData?: CreateSmtpInput | null;
};

const SmtpFormDialog = ({ open, onOpenChange, isEditing }: SmtpFormDialogProps) => {
  const { createSMTP, isCreatingSMTP } = useEmail();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSmtpInput>({
    defaultValues: {
      fromEmail: "",
      credentials: {
        host: "",
        port: 587,
        user: "",
        pass: "",
      },
    },
  });

  const onSubmit = (data: CreateSmtpInput) => {
    createSMTP(data, {
      onSuccess: () => reset()
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            {isEditing ? "Edit SMTP Fallback" : "Add SMTP Fallback"}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            Used if the primary provider fails.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* From Email */}
          <div className="space-y-2">
            <Label htmlFor="fromEmail" className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              From Email
            </Label>
            <Input
              id="fromEmail"
              placeholder="noreply@yourdomain.com"
              {...register("fromEmail", { required: "Required" })}
            />
            {errors.fromEmail && (
              <p className="text-destructive text-xs">{errors.fromEmail.message}</p>
            )}
          </div>

          {/* Host + Port */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                placeholder="smtp.mailtrap.io"
                {...register("credentials.host", { required: "Required" })}
              />
              {errors.credentials?.host && (
                <p className="text-destructive text-xs">{errors.credentials.host.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">Port</Label>
              <Input
                id="smtpPort"
                type="number"
                placeholder="587"
                {...register("credentials.port", {
                  required: "Required",
                  valueAsNumber: true,
                })}
              />
              {errors.credentials?.port && (
                <p className="text-destructive text-xs">{errors.credentials.port.message}</p>
              )}
            </div>
          </div>

          {/* User + Pass */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtpUser">Username</Label>
              <Input
                id="smtpUser"
                placeholder="user@example.com"
                {...register("credentials.user", { required: "Required" })}
              />
              {errors.credentials?.user && (
                <p className="text-destructive text-xs">{errors.credentials.user.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPass">Password</Label>
              <Input
                id="smtpPass"
                type="password"
                placeholder="••••••••"
                {...register("credentials.pass", { required: "Required" })}
              />
              {errors.credentials?.pass && (
                <p className="text-destructive text-xs">{errors.credentials.pass.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary" disabled={isCreatingSMTP}>
              {isCreatingSMTP && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Test & Save Fallback"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SmtpFormDialog;
