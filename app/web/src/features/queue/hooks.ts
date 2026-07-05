import type { CreateQueueInput, UpdateQueueInput } from "@org/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queueApi } from "./api";
interface props {
  groupId?: string;
  queueId?: string;
}
export function useQueue({ groupId, queueId }: props = {}) {
  const queryClient = useQueryClient();
  const {
    data: queues,
    isLoading: isLoadingQueues,
    error: queueError,
  } = useQuery({
    queryFn: () => queueApi.getByGroupId(groupId!),
    queryKey: ["queue", { groupId }],
    enabled: !!groupId,
  });
  const {
    data: queuesDetails,
    isLoading: isLoadingDetails,
    error: queueDetailsError,
  } = useQuery({
    queryFn: () => queueApi.getDetails(queueId!),
    queryKey: ["queue", "details", { queueId }],
    enabled: !!queueId,
  });
  const {
    data: queueSummary,
    isLoading: isLoadingQueueSummary,
    error: queueSummaryError,
  } = useQuery({
    queryFn: () => queueApi.getSummary(queueId!),
    queryKey: ["queue", "summary", { queueId }],
    enabled: !!queueId,
  });
  const { mutate: createQueue, isPending: isCreatingQueue } = useMutation({
    mutationFn: ({ groupId, data }: { groupId: string; data: CreateQueueInput }) =>
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
    mutationFn: ({ queueId, data }: { queueId: string; data: UpdateQueueInput }) =>
      queueApi.update(queueId, data),
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
    queuesDetails,
    isLoadingDetails,
    queueSummary,
    isLoadingQueueSummary,
    queueError,
    queueDetailsError,
    queueSummaryError,
  };
}
