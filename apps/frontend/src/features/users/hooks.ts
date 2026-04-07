import type { UpdateMyDetailsInput } from "@repo/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "./api";

const useUser = () => {
  const queryClient = useQueryClient();
  const { data: userDetails, isLoading: isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: userApi.myDetails,
  });

  const { mutate: updateMyDetails, isPending: isUpdating } = useMutation({
    mutationFn: (input: UpdateMyDetailsInput) => userApi.updateMyDetails(input),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { userDetails, isLoading, updateMyDetails, isUpdating };
};

export default useUser;
