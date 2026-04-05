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
import { Textarea } from "@/components/ui/textarea"; // Added for description
import { zodResolver } from "@hookform/resolvers/zod";
import { updateOrganizationInput, type UpdateOrganizationInput } from "@repo/schemas";
import { useForm } from "react-hook-form";
import useOrganizations from "../organization/hooks";

const OrganizationForm = () => {
  const { currentOrganization, isLoadingCurrent, updateOrg, isUpdatingOrg } = useOrganizations();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<UpdateOrganizationInput>({
    resolver: zodResolver(updateOrganizationInput.bodySchema),
    defaultValues: {
      name: currentOrganization?.data.name,
      slug: currentOrganization?.data.slug || undefined,
      description: currentOrganization?.data.description || undefined,
    },
  });

  const isDirty = Object.keys(dirtyFields).length === 0;
  const onSubmit = async (data: UpdateOrganizationInput) => updateOrg(data);
  if (isLoadingCurrent) return <div>Loading organization...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
          <CardDescription>
            Created on{" "}
            {currentOrganization?.data.createdAt &&
              new Date(currentOrganization?.data.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input id="name" {...register("name")} placeholder="Acme Inc." />
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Workspace URL</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">app.com/</span>
              <Input id="slug" {...register("slug")} placeholder="acme-inc" />
            </div>
            {errors.slug && <p className="text-destructive text-xs">{errors.slug.message}</p>}
          </div>

          {/* Description (from your JSON) */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Tell us about your organization..."
            />
            {errors.description && (
              <p className="text-destructive text-xs">{errors.description.message}</p>
            )}
          </div>

          {/* Read-only info from your JSON */}
          <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
            <div>
              <p className="text-muted-foreground">Org Code</p>
              <p className="font-mono">{currentOrganization?.data.code}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Team Size</p>
              <p>{currentOrganization?.data.teamSize} members</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-muted-foreground text-xs">
            Type:{" "}
            <span className="capitalize">{currentOrganization?.data.type?.toLowerCase()}</span>
          </p>
          <Button type="submit" disabled={isDirty || isUpdatingOrg}>
            {isUpdatingOrg ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default OrganizationForm;
