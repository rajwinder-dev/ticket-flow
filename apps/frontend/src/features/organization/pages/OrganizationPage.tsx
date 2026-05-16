import OrganizationSection from "@/features/organization/components/OrganizationSection";

import { Joyride } from "react-joyride";
const steps = [{ content: "Create your first organization", target: ".create-org" }];
const OrganizationPage = () => {
  return (
    // Wrap the page in 'dark' to get the dark theme

    <div className="mt-20">
      <Joyride continuous run={true} steps={steps} />
      <OrganizationSection />
    </div>
  );
};

export default OrganizationPage;
