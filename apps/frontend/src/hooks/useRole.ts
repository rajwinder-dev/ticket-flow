import { useQuery } from "@tanstack/react-query";
import { getMyRole } from "../actions/roleAssign";

const useRole = () => {
  const { data: userRole, isFetching: isFetchingRole ,isSuccess : isLoggedIn} = useQuery({
    queryKey: ["userData"],
    queryFn: () => getMyRole(),
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 0
  });
  return { userRole, isFetchingRole , isLoggedIn };
};

export default useRole;
