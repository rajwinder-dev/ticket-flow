import { Spinner } from "@/components/ui/spinner";
import { useGlobalContext } from "@/context/GlobalContext";
import useOrganizations from "@/features/organization/hooks";
import OrganizationPage from "@/features/organization/pages/OrganizationPage";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router";

const OrgLayout = () => {
  const { orgId } = useParams();
  const { setOrgId } = useGlobalContext();
  useEffect(() => {
    if (orgId) setOrgId(orgId);
  }, [orgId]);
  const { organizations, isLoadingOrganizations } = useOrganizations();
  if (isLoadingOrganizations) return <Spinner />;
  const isExist = organizations?.data.find((org) => org.id === orgId);
  if (!isExist) return <OrganizationPage />;
  return <Outlet />;
};

export default OrgLayout;
