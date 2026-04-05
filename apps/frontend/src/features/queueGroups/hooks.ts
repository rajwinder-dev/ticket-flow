import type { CreateQueueGroupInput } from "@repo/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import queueGroupApi from "./api";

function useQueueGroup() {
  const queryClient = useQueryClient();
  const { data: queueGroups, isLoading: isLoadingQueueGroups } = useQuery({
    queryFn: queueGroupApi.getAll,
    queryKey: ["groups"],
    retry: false,
  });
  
  const { mutate: createGroup, isPending: isCreatingGroup } = useMutation({
    mutationFn: (data: CreateQueueGroupInput) => queueGroupApi.create(data),
    onSuccess: () => {
      toast.success("group created successfully");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateGroup, isPending: isUpdatingGroup } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateQueueGroupInput }) =>
      queueGroupApi.update(id, data),
    onSuccess: () => {
      toast.success("group updated successfully");
      queryClient.invalidateQueries({ queryKey: ["group"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteGroup, isPending: isDeletingGroup } = useMutation({
    mutationFn: (groupId: string) => queueGroupApi.delete(groupId),
    onSuccess: () => {
      toast.success("group deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: changeDefaultGroup, isPending: isChangingDefaultGroup } = useMutation({
    mutationFn: (groupId: string) => queueGroupApi.delete(groupId),
    onSuccess: () => {
      toast.success("group deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return {
    queueGroups,
    isLoadingQueueGroups,
    createGroup,
    isCreatingGroup,
    updateGroup,
    isUpdatingGroup,
    deleteGroup,
    isDeletingGroup,
    changeDefaultGroup,
    isChangingDefaultGroup,
  };
}

export default useQueueGroup;
