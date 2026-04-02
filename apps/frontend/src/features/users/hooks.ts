import { useQuery } from "@tanstack/react-query"
import { userApi } from "./api"

const useUser = () => {
  const {data: userDetails , isLoading: isLoading} = useQuery({
    queryKey: ["user"],
    queryFn: userApi.myDetails,
  })
  return {userDetails, isLoading}
}

export default useUser
