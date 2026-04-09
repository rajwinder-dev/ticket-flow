"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateEmailProviderInput, EmailProviderSchema } from "@repo/schemas";
import { KeyRound, Mail, Webhook } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import useEmail from "../../hooks";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  providerData?: EmailProviderSchema | null;
};

export function ProviderFormDialog({ open, onOpenChange, isEditing, providerData }: Props) {
  const { createEmailProvider, isCreatingEmailProvider, updateCredentials, isUpdatingCredentials } =
    useEmail();
  const isSublimiting = isCreatingEmailProvider || isUpdatingCredentials;
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateEmailProviderInput>({
    defaultValues: {
      providerType: providerData?.providerType || "RESEND",
      fromEmail: providerData?.fromEmail,
      credentials: { apiKey: "" },
      webhookSecret: "",
    },
  });

  const onSubmit = (data: CreateEmailProviderInput) => {
    if (isEditing) {
      if (!providerData?.id) return console.error("email provider not provided to edit");
      return updateCredentials(
        { id: providerData?.id, data },
        {
          onSuccess: () => {
            onOpenChange(false);
            reset();
          },
        },
      );
    }
    createEmailProvider(data, {
      onSuccess: () => {
        onOpenChange(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Email Provider" : "Add Email Provider"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Provider Type */}
          <div className="space-y-1.5">
            <Label>Provider Type</Label>
            <Controller
              name="providerType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RESEND">Resend</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* From Email */}
          <div className="space-y-1.5">
            <Label htmlFor="fromEmail" className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              From Email
            </Label>
            <Input
              id="fromEmail"
              type="email"
              placeholder="noreply@yourdomain.com"
              {...register("fromEmail", { required: "Required" })}
            />
            {errors.fromEmail && (
              <p className="text-destructive text-xs">{errors.fromEmail.message}</p>
            )}
          </div>

          {/* Nested API Key */}
          <div className="space-y-1.5">
            <Label htmlFor="apiKey" className="flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5" />
              API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="••••••••••••••••"
              {...register("credentials.apiKey", { required: "API Key is required" })}
            />
            {errors.credentials?.apiKey && (
              <p className="text-destructive text-xs">{errors.credentials.apiKey.message}</p>
            )}
          </div>

          {/* Webhook Secret */}
          <div className="space-y-1.5">
            <Label htmlFor="webhookSecret" className="flex items-center gap-1.5">
              <Webhook className="h-3.5 w-3.5" />
              Webhook Secret
              <span className="text-muted-foreground ml-1 text-xs font-normal">(optional)</span>
            </Label>
            <Input
              id="webhookSecret"
              type="password"
              placeholder="••••••••••••••••"
              {...register("webhookSecret")}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSublimiting}>
              {isEditing ? "Save Changes" : "Add Provider"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
