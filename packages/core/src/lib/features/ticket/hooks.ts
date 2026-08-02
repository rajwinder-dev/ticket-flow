import type {
  FilterOptions,
  PaginateResponse,
  ApiResponse,
} from '@org/web-utils';
import {
  TicketSchemaResponse,
  type AssignTicketInput,
  type CreateTicketCommentInput,
  type CreateTicketInput,
  type EscalateTicketInput,
  type UpdateTicketInput,
  type UpdateTicketPriorityInput,
  type UpdateTicketStatusInput,
} from '@org/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from './api.js';
import useOptimisticUpdates from '../../optimisticUI.hook.js';
interface props {
  filterOptions?: FilterOptions;
  orgId: string | undefined;
  ticketId?: string | undefined;
  assignedTo?: Record<string, string | null>;
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
}
export function useTicket({
  filterOptions,
  orgId,
  ticketId,
  assignedTo,
  user,
}: props) {
  const { updateCache, rollback } = useOptimisticUpdates();
  const queryClient = useQueryClient();
  const {
    data: ticketData,
    isLoading: isLoadingTicketData,
    error: ticketDataError,
  } = useQuery({
    queryFn: () => ticketApi.getAll(filterOptions),
    queryKey: ['ticket', { orgId }, filterOptions],
    enabled: !!orgId,
  });
  const {
    data: ticketSummary,
    isLoading: isLoadingTicketSummary,
    error: ticketSummaryError,
  } = useQuery({
    queryFn: () => ticketApi.getSummary(assignedTo),
    queryKey: ['ticket', 'summary', { orgId, assignedTo }],
    enabled: !!orgId,
  });
  const {
    data: assignedTicket,
    isLoading: isLoadingAssigned,
    error: assignedTicketDataError,
  } = useQuery({
    queryFn: ticketApi.getAssigned,
    queryKey: ['ticket', 'me', { orgId }],
    enabled: !!orgId,
  });
  const {
    data: ticketDetails,
    isLoading: isLoadingTicketDetails,
    error: ticketDetailsError,
  } = useQuery({
    queryFn: () => ticketApi.getDetails(ticketId!),
    queryKey: ['ticket', 'details', { ticketId, orgId }],
    enabled: !!ticketId,
  });
  const {
    data: ticketComments,
    isLoading: isLoadingTicketComments,
    error: ticketCommentsError,
  } = useQuery({
    queryFn: () => ticketApi.getComments(ticketId!),
    queryKey: ['ticket', 'comment', { ticketId, orgId }],
    enabled: !!ticketId,
  });
  const {
    data: ticketTransitions,
    isLoading: isLoadingTicketTransitions,
    error: ticketTransitionsError,
  } = useQuery({
    queryFn: () => ticketApi.getTransitionHistory(ticketId!),
    queryKey: ['ticket', 'transitions', { ticketId, orgId }],
    enabled: !!ticketId,
  });
  const { mutate: createTicket, isPending: isCreatingTicket } = useMutation({
    mutationFn: (data: CreateTicketInput) => ticketApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
    },
  });
  const { mutate: updateTicket, isPending: isUpdatingTicket } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketInput }) =>
      ticketApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
    },
    onError: (_error, _variables, context: any) => {
      rollback({
        queryKey: [
          'ticket',
          'details',
          { orgId, ticketId: context.previousData.id },
        ],
        previousData: context.previousData,
      });
    },
    onMutate: async (data) => {
      return await updateCache<ApiResponse<TicketSchemaResponse>>({
        queryKey: ['ticket', 'details', { orgId, ticketId: data.id }],
        updater: (old: any) => {
          console.log(old);
          return {
            ...old,
            data: {
              ...old?.data,
              ...data.data,
            },
          };
        },
      });
    },
  });
  const { mutate: updateTicketStatus, isPending: isUpdatingTicketStatus } =
    useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: UpdateTicketStatusInput;
      }) => ticketApi.updateStatus(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticket'] });
      },
      onError: (_error, _variables, context: any) => {
        rollback({
          queryKey: ['ticket', 'details', { orgId, ticketId }],
          previousData: context.previousData,
        });
      },
      onMutate: async (data) => {
        return await updateCache<ApiResponse<TicketSchemaResponse>>({
          queryKey: ['ticket', 'details', { orgId, ticketId: data.id }],
          updater: (old: any) => {
            console.log(old);
            return {
              ...old,
              data: {
                ...old?.data,
                status: data.data.status,
              },
            };
          },
        });
      },
    });
  const { mutate: updateTicketPriority, isPending: isUpdatingTicketPriority } =
    useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: UpdateTicketPriorityInput;
      }) => ticketApi.updatePriority(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticket'] });
      },
      onError: (_error, _variables, context: any) => {
        rollback({
          queryKey: [
            'ticket',
            'details',
            { orgId, ticketId: context.previousData.id },
          ],
          previousData: context.previousData,
        });
      },
      onMutate: async (data) => {
        console.log(filterOptions);
        if (filterOptions)
          await updateCache({
            queryKey: ['ticket', { orgId }, filterOptions],
            updater: (old: any) => {
              console.log(old);
            },
          });
        return await updateCache<ApiResponse<TicketSchemaResponse>>({
          queryKey: ['ticket', 'details', { orgId, ticketId: data.id }],
          updater: (old: any) => {
            return {
              ...old,
              data: {
                ...old?.data,
                priority: data.data.priority,
              },
            };
          },
        });
      },
    });
  const { mutate: assignTicket, isPending: isAssigningTicket } = useMutation({
    mutationFn: ({
      ticketId,
      data,
    }: {
      ticketId: string;
      data: AssignTicketInput;
    }) => ticketApi.assignTicket(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
    },
  });
  const { mutate: commentTicket, isPending: isCreateingComment } = useMutation({
    mutationFn: ({
      ticketId,
      data,
    }: {
      ticketId: string;
      data: CreateTicketCommentInput;
    }) => ticketApi.comment(ticketId, data),
    onError: (_error, _variables, context: any) => {
      rollback({
        queryKey: [
          'ticket',
          'comment',
          { orgId, ticketId: context?.previousData?.id },
        ],
        previousData: context?.previousData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ticket', 'comment', { orgId, ticketId }],
      });
    },
    onMutate: async (data) => {
      return await updateCache<PaginateResponse<TicketSchemaResponse>>({
        queryKey: ['ticket', 'comment', { orgId, ticketId: data.ticketId }],
        updater: (old: any) => {
          return {
            ...old,
            data: [
              ...(old?.data ?? []),
              {
                ...data.data,
                createdAt: new Date(),
                author: {
                  name: user?.name!,
                  email: user?.email!,
                },
              },
            ],
          };
        },
      });
    },
  });
  const { mutate: escalateTicket, isPending: isEscalatingTicket } = useMutation(
    {
      mutationFn: ({
        ticketId,
        data,
      }: {
        ticketId: string;
        data: EscalateTicketInput;
      }) => ticketApi.escalate(ticketId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ticket'] });
      },
    },
  );
  const {
    mutate: generateTicketSummary,
    isPending: isGeneratingTicketSummary,
  } = useMutation({
    mutationFn: ({
      ticketId,
    }: {
      ticketId: string;
    }) => ticketApi.generateSummary(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ticket', 'details', { orgId, ticketId }],
      });
    },
  });
  return {
    ticketData,
    isLoadingTicketData,
    createTicket,
    isCreatingTicket,
    updateTicketPriority,
    isUpdatingTicketPriority,
    assignTicket,
    isAssigningTicket,
    assignedTicket,
    isLoadingAssigned,
    ticketDetails,
    isLoadingTicketDetails,
    updateTicketStatus,
    isUpdatingTicketStatus,
    commentTicket,
    isCreateingComment,
    escalateTicket,
    isEscalatingTicket,
    updateTicket,
    isUpdatingTicket,
    ticketSummary,
    isLoadingTicketSummary,
    ticketComments,
    isLoadingTicketComments,
    ticketTransitions,
    isLoadingTicketTransitions,
    ticketDetailsError,
    ticketCommentsError,
    ticketTransitionsError,
    ticketDataError,
    ticketSummaryError,
    assignedTicketDataError,
    generateTicketSummary,
    isGeneratingTicketSummary,
  };
}
