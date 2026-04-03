import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/features/setting/ProfileTab";
import GeneralTab from "@/features/setting/tabs/GeneralTab";
import OrganizationTab from "@/features/setting/tabs/OrganizationTab";
import SecurityTab from "@/features/setting/tabs/SecurityTab";
import { Building2, Lock, Settings2, User } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="block space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />

      <Tabs
        defaultValue="profile"
        className="flex space-y-8 md:flex-row md:space-y-0 md:space-x-12"
      >
        <aside className="md:w-1/5 ">
          <TabsList className="flex h-auto justify-start space-y-1 p-0 md:bg-transparent">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-muted w-full justify-start gap-2 px-4 py-2"
            >
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-muted w-full justify-start gap-2 px-4 py-2"
            >
              <Lock className="h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger
              value="organization"
              className="data-[state=active]:bg-muted w-full justify-start gap-2 px-4 py-2"
            >
              <Building2 className="h-4 w-4" /> Organization
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-muted w-full justify-start gap-2 px-4 py-2"
            >
              <Settings2 className="h-4 w-4" /> General
            </TabsTrigger>
          </TabsList>
        </aside>
        <div className="flex-1 md:max-w-2xl my-4">
          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-0">
            <ProfileTab />
          </TabsContent>
          {/* Security Tab */}
          <TabsContent value="security" className="mt-0">
            <SecurityTab />
          </TabsContent>
          {/* Organization Tab */}
          <TabsContent value="organization" className="mt-0">
            <OrganizationTab />
          </TabsContent>
          {/* General Settings Tab */}
          <TabsContent value="settings" className="mt-0">
            <GeneralTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
