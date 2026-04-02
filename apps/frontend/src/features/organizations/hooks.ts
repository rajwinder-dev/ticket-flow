import { useQuery } from "@tanstack/react-query";
import { getOrganizations } from "./api";

const useOrganizations = () => {
  const { data: organizations, isLoading: isLoadingOrganizations } = useQuery({
    queryFn: getOrganizations,
    queryKey: ["organizations"],
  });
  return { organizations, isLoadingOrganizations };
};

export default useOrganizations;
