import { useGlobalContext } from "@/context/GlobalContext";
import OrganizationPage from "@/features/organization/pages/OrganizationPage";
import { useOrganizations } from "@org/core";
import { useEffect } from "react";
import { Outlet, useParams } from "react-router";

const OrgLayout = () => {
  const { orgId } = useParams();
  const { setOrgId } = useGlobalContext();
  useEffect(() => {
    if (orgId) setOrgId(orgId);
  }, [orgId]);
  const { organizations } = useOrganizations({orgId});
  const isExist = organizations?.data.find((org) => org.id === orgId);
  if (!isExist) return <OrganizationPage />;
  return <Outlet />;
};

export default OrgLayout;
