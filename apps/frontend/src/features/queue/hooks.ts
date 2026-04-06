import type { CreateQueueInput, UpdateQueueInput } from "@repo/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queueApi } from "./api";

export function useQueue(groupId?: string | null) {
  const queryClient = useQueryClient();
  const { data: queues, isLoading: isLoadingQueues } = useQuery({
    queryFn: () => queueApi.getByGroupId(groupId!),
    queryKey: ["queue", groupId],
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
    queues,
    isLoadingQueues,
    createdQueue,
    isCreatingQueue,
    updatedQueue,
    isUpdatingQueue,
    deletedQueue,
    isDeletingQueue,
  };
}
