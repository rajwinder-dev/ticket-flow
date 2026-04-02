import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const GeneralSettingsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>System-wide preferences and notification settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-muted-foreground text-sm font-light">
              Receive emails about account activity.
            </p>
          </div>
          {/* Assuming you have a Switch component from shadcn */}
          {/* <Switch /> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettingsTab;
