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
import { type CreateOrganizationInput, createOrganizationInput } from "@org/zod";
import useOrganizations from "../hooks";
import { useNavigate } from "react-router";
const CreateOrganizationForm = () => {
  const navigate = useNavigate();
  const { createOrg, isCreatingOrg } = useOrganizations();
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
        <Button type="button" variant={"secondary"} onClick={() => navigate(-1)}>
          Back
        </Button>
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
