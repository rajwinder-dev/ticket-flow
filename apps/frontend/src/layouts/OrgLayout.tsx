import { Spinner } from "@/components/ui/spinner";
import useOrganizations from "@/features/organizations/hooks";
import { Outlet, useParams } from "react-router";

const OrgLayout = () => {
  const { orgId } = useParams();
  const {organizations ,isLoadingOrganizations} = useOrganizations();
  if(isLoadingOrganizations) return <Spinner />
  const isExist = organizations?.data.find(org => org.id === orgId);
  if(!isExist) return <div>Organization not found</div>
  return <div>{<Outlet />}</div>;
};

export default OrgLayout;
