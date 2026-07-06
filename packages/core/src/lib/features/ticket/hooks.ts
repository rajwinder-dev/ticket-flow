import type { FilterOptions } from '@org/web-utils';
import type {
  AssignTicketInput,
  CreateTicketCommentInput,
  CreateTicketInput,
  EscalateTicketInput,
  UpdateTicketInput,
  UpdateTicketPriorityInput,
  UpdateTicketStatusInput,
} from '@org/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from './api.js';
interface props {
  filterOptions?: FilterOptions;
  orgId: string | undefined;
  ticketId?: string | undefined;
  assignedTo?: Record<string, string | null>;
}
export function useTicket({
  filterOptions,
  orgId,
  ticketId,
  assignedTo,
}: props) {
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
    queryKey: ['ticket', 'details', { ticketId }],
    enabled: !!ticketId,
  });
  const {
    data: ticketComments,
    isLoading: isLoadingTicketComments,
    error: ticketCommentsError,
  } = useQuery({
    queryFn: () => ticketApi.getComments(ticketId!),
    queryKey: ['ticket', 'comment', { ticketId }],
    enabled: !!ticketId,
  });
  const {
    data: ticketTransitions,
    isLoading: isLoadingTicketTransitions,
    error: ticketTransitionsError,
  } = useQuery({
    queryFn: () => ticketApi.getTransitionHistory(ticketId!),
    queryKey: ['ticket', 'transitions', { ticketId }],
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
  const { mutate: commentTicket, isPending: isAssigningComment } = useMutation({
    mutationFn: ({
      ticketId,
      data,
    }: {
      ticketId: string;
      data: CreateTicketCommentInput;
    }) => ticketApi.comment(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
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
    isAssigningComment,
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
  };
}
