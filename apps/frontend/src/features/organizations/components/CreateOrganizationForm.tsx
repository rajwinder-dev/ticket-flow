import { Globe, Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateOrganizationInput, createOrganizationInput } from "@repo/schemas";
import useOrganizations from "../hooks";
const CreateOrganizationForm = () => {
  const {createOrg, isCreatingOrg} =  useOrganizations()
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationInput.bodySchema),
    defaultValues: {
      type: "PERSONAL",
      teamSize: 5,
    },
  });
  const name = useWatch({
    control,
    name: "name",
  });
  const slug = name
    ?.trim()
    .toLowerCase()
    .replace(/\s+/g, "-") // spaces → dash
    .replace(/[^a-z0-9-]/g, "") // remove special chars
    .replace(/-+/g, "-"); // remove duplicate dashes
  setValue("slug", slug);

  const onSubmit = (data: CreateOrganizationInput) => {
    createOrg(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5 text-blue-500" />
            General Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input id="name" placeholder="Acme Corp" {...register("name")} />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input id="slug" placeholder="acme-corp" {...register("slug")} />
            {errors.slug && <p className="text-destructive text-xs">{errors.slug.message}</p>}
          </div>
        </CardContent>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="teamSize">Team Size</Label>
            <Input
              id="teamSize"
              placeholder="27"
              type="number"
              {...register("teamSize", {
                valueAsNumber: true,
                min: 1,
              })}
            />
            {errors.teamSize && (
              <p className="text-destructive text-xs">{errors.teamSize.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select {...register("type")} defaultValue={"PERSONAL"}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERSONAL">Personal</SelectItem>
                <SelectItem value="TEAM">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button type="submit" disabled={isCreatingOrg}>
          {isCreatingOrg && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Organization
        </Button>
      </div>
    </form>
  );
};

export default CreateOrganizationForm;

{
  /* <Button
            type="button"
            variant="secondary"
            onClick={onTestConnection}
            disabled={isTesting || isSubmitting}
          >
            {isTesting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="mr-2 h-4 w-4" />
            )}
            Test Connection
          </Button> */
}
{
  /* Section 2: Primary Email */
}
{
  /* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Send className="h-5 w-5 text-green-500" />
              Primary Email Provider
            </CardTitle>
            <CardDescription>Managed API service for main delivery.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select
                defaultValue="RESEND"
                onValueChange={(val) => setValue("primaryProvider", val as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESEND">Resend</SelectItem>
                  <SelectItem value="SENDGRID">SendGrid</SelectItem>
                  <SelectItem value="POSTMARK">Postmark</SelectItem>
                  <SelectItem value="SES">AWS SES</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">{selectedProvider} API Key</Label>
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
        </Card> */
}

{
  /* Section 3: SMTP Fallback */
}
{
  /* <Card className="border-dashed">
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
                <Input id="smtpPort" type="number" {...register("smtpPort")} />
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtpUser">Username</Label>
                <Input id="smtpUser" {...register("smtpUser")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPass">Password</Label>
                <Input id="smtpPass" type="password" {...register("smtpPassword")} />
              </div>
            </div>
          </CardContent>
        </Card> */
}
