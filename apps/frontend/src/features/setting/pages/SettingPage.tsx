import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/features/setting/components/ProfileTab";

import { Building2, Lock, Settings2, User } from "lucide-react";
import GeneralTab from "../components/tabs/GeneralTab";
import OrganizationTab from "../components/tabs/OrganizationTab";
import SecurityTab from "../components/tabs/SecurityTab";

export default function SettingsPage() {
  return (
    <div className="block">
      <PageHeader
        title="Settings"
        description="mange your account and organization settings, including profile information, security
            preferences, and general application settings."
      />

      <Tabs
        defaultValue="profile"
        className="flex space-y-8 p-8 md:flex-row md:space-y-0 md:space-x-12"
      >
        <aside className="md:w-1/5">
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
        <div className="my-4 flex-1 md:max-w-2xl">
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
