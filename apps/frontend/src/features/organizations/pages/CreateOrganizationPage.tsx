import CreateOrganizationForm from "@/features/organizations/components/CreateOrganizationForm";

export default function CreateOrganizationPage() {
  return (
    <div className="container mx-auto max-w-3xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Organizations</h1>
        <p className="text-muted-foreground mt-1">
          Set up your organization to manage your projects and teams effectively.
        </p>
      </div>
      <CreateOrganizationForm />
    </div>
  );
}
