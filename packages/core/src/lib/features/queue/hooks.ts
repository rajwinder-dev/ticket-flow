import type { CreateQueueInput, UpdateQueueInput } from '@org/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queueApi } from './api.js';
interface props {
  groupId?: string;
  queueId?: string;
  agents?: boolean;
}
export function useQueue({ groupId, queueId, agents }: props = {}) {
  const queryClient = useQueryClient();
  const {
    data: queues,
    isLoading: isLoadingQueues,
    error: queueError,
  } = useQuery({
    queryFn: () => queueApi.getByGroupId(groupId!),
    queryKey: ['queue', { groupId }],
    enabled: !!groupId,
  });
  const {
    data: queuesAgents,
    isLoading: isLoadingQueuesAgents,
    error: queueAgentError,
  } = useQuery({
    queryFn: () => queueApi.getAgents(queueId!),
    queryKey: ['queue', 'agents', { queueId }],
    enabled: !!queueId && agents,
  });
  const {
    data: queuesDetails,
    isLoading: isLoadingDetails,
    error: queueDetailsError,
  } = useQuery({
    queryFn: () => queueApi.getDetails(queueId!),
    queryKey: ['queue', 'details', { queueId }],
    enabled: !!queueId,
  });
  const {
    data: queueSummary,
    isLoading: isLoadingQueueSummary,
    error: queueSummaryError,
  } = useQuery({
    queryFn: () => queueApi.getSummary(queueId!),
    queryKey: ['queue', 'summary', { queueId }],
    enabled: !!queueId,
  });
  const { mutate: createQueue, isPending: isCreatingQueue } = useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: CreateQueueInput;
    }) => queueApi.create(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue', { groupId }] });
    },
  });

  const { mutate: updatedQueue, isPending: isUpdatingQueue } = useMutation({
    mutationFn: ({
      queueId,
      data,
    }: {
      queueId: string;
      data: UpdateQueueInput;
    }) => queueApi.update(queueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue', { groupId }] });
    },
  });

  const { mutate: deleteQueue, isPending: isDeletingQueue } = useMutation({
    mutationFn: (queueId: string) => queueApi.delete(queueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue', { groupId }] });
    },
  });

  return {
    queues,
    isLoadingQueues,
    createQueue,
    isCreatingQueue,
    updatedQueue,
    isUpdatingQueue,
    deleteQueue,
    isDeletingQueue,
    queuesDetails,
    isLoadingDetails,
    queueSummary,
    isLoadingQueueSummary,
    queueError,
    queueDetailsError,
    queueSummaryError,
    queuesAgents,
    isLoadingQueuesAgents,
    queueAgentError,
  };
}
