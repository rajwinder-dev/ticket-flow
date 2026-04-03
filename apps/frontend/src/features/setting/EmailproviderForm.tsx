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
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
const EmailProviderForm = () => {
  // 2. Initialize the form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      primaryProvider: "RESEND",
      primaryApiKey: "",
    },
  });

  // Watch the provider to update the label dynamically
  const selectedProvider = watch("primaryProvider");

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    // Add your API logic here
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
          {/* Provider Select */}
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select
              defaultValue="RESEND"
              onValueChange={(val) => setValue("primaryProvider", val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RESEND">Resend</SelectItem>
              </SelectContent>
            </Select>
            {errors.primaryProvider && (
              <p className="text-destructive text-xs">{errors.primaryProvider.message}</p>
            )}
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">
              {selectedProvider.charAt(0) + selectedProvider.slice(1).toLowerCase()} API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk_..."
              {...register("primaryApiKey")}
            />
            {errors.primaryApiKey && (
              <p className="text-destructive text-xs">{errors.primaryApiKey.message}</p>
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
