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

const OrganizationForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization</CardTitle>
        <CardDescription>Manage your team and workspace details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="org-name">Organization Name</Label>
          <Input id="org-name" placeholder="Acme Inc." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Workspace URL</Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">app.com/</span>
            <Input id="slug" placeholder="acme-inc" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};

export default OrganizationForm;
