import type { CreateQueueInput, UpdateQueueInput } from "@repo/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { toast } from "sonner";
import { queueApi } from "./api";

export function useQueued() {
  const { groupId } = useParams();
  const queryClient = useQueryClient();
  const { data: queue, isLoading: isLoadingQueue } = useQuery({
    queryFn: () => queueApi.getByGroupId(groupId!),
    queryKey: ["queue"],
    enabled: !!groupId,
  });

  const { mutate: createdQueue, isPending: isCreatingQueue } = useMutation({
    mutationFn: ({ groupId, data }: { groupId: string; data: CreateQueueInput }) =>
      queueApi.create(groupId, data),
    onSuccess: () => {
      toast.success("queue created successfully");
      queryClient.invalidateQueries({ queryKey: ["queue"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updatedQueue, isPending: isUpdatingQueue } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQueueInput }) => queueApi.update(id, data),
    onSuccess: () => {
      toast.success("queue updated successfully");
      queryClient.invalidateQueries({ queryKey: ["queue"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deletedQueue, isPending: isDeletingQueue } = useMutation({
    mutationFn: (queueId: string) => queueApi.delete(queueId),
    onSuccess: () => {
      toast.success("queue deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["queue"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    queue,
    isLoadingQueue,
    createdQueue,
    isCreatingQueue,
    updatedQueue,
    isUpdatingQueue,
    deletedQueue,
    isDeletingQueue,
  };
}
