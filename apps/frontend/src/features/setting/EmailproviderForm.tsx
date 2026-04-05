import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEmailProviderInput, type CreateEmailProviderInput } from "@repo/schemas";




const EmailProviderForm = () => {
  // 2. Initialize the form with the resolver
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateEmailProviderInput>({
    resolver: zodResolver(createEmailProviderInput.bodySchema),
    defaultValues: {
      providerType: "RESEND",
      fromEmail: "",
      webhookSecret: "",
      credentials: {
        apiKey: ''
      }
    },
  });

  const selectedProvider = watch("providerType");

  const onSubmit = (data: CreateEmailProviderInput) => {
    console.log("Form Submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Send className="h-5 w-5 text-green-500" />
            Primary Email Provider
          </CardTitle>
          <CardDescription>Managed API service for main delivery.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">

          {/* Provider Select - Using Controller for Shadcn Select */}
          <div className="space-y-2">
            <Label>Provider</Label>
            <Controller
              control={control}
              name="providerType"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RESEND">Resend</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.providerType && (
              <p className="text-destructive text-xs">{errors.providerType.message}</p>
            )}
          </div>

          {/* From Email Input */}
          <div className="space-y-2">
            <Label htmlFor="fromEmail">From Email</Label>
            <Input
              id="fromEmail"
              placeholder="hello@example.com"
              {...register("fromEmail")}
            />
            {errors.fromEmail && (
              <p className="text-destructive text-xs">{errors.fromEmail.message}</p>
            )}
          </div>

          {/* API Key Input - Nested path */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">
              {selectedProvider.charAt(0) + selectedProvider.slice(1).toLowerCase()} API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="re_..."
              {...register("credentials.apiKey")}
            />
            {errors.credentials?.message && (
              <p className="text-destructive text-xs">{errors.credentials.message}</p>
            )}
          </div>

          {/* Webhook Secret Input */}
          <div className="space-y-2">
            <Label htmlFor="webhookSecret">Webhook Secret (Optional)</Label>
            <Input
              id="webhookSecret"
              placeholder="whsec_..."
              {...register("webhookSecret")}
            />
            {errors.webhookSecret && (
              <p className="text-destructive text-xs">{errors.webhookSecret.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Configuration
        </Button>
      </div>
    </form>
  );
};

export default EmailProviderForm;
