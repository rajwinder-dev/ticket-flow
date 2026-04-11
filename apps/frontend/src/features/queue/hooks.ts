import type { CreateQueueInput, UpdateQueueInput } from "@repo/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queueApi } from "./api";

export function useQueue(groupId?: string ) {

  const queryClient = useQueryClient();
  const { data: queues, isLoading: isLoadingQueues } = useQuery({
    queryFn: () => queueApi.getByGroupId(groupId!),
    queryKey: ["queue", { groupId }],
    enabled: !!groupId,
  });

  const { mutate: createQueue, isPending: isCreatingQueue } = useMutation({
    mutationFn: ({groupId, data}:{groupId: string,  data: CreateQueueInput }) =>
      queueApi.create(groupId, data),
    onSuccess: () => {
      toast.success("queue created successfully");
      queryClient.invalidateQueries({ queryKey: ["queue", { groupId }] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updatedQueue, isPending: isUpdatingQueue } = useMutation({
    mutationFn: ({ queueId, data }: { queueId: string; data: UpdateQueueInput }) => queueApi.update(queueId, data),
    onSuccess: () => {
      toast.success("queue updated successfully");
      queryClient.invalidateQueries({ queryKey: ["queue", { groupId }] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deletedQueue, isPending: isDeletingQueue } = useMutation({
    mutationFn: (queueId: string) => queueApi.delete(queueId),
    onSuccess: () => {
      toast.success("queue deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["queue", { groupId }] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    queues,
    isLoadingQueues,
    createQueue,
    isCreatingQueue,
    updatedQueue,
    isUpdatingQueue,
    deletedQueue,
    isDeletingQueue,
  };
}
