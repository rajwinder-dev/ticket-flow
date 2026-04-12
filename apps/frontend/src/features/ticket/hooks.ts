import type {
  AssignTicketInput,
  CreateTicketCommentInput,
  CreateTicketInput,
  EscalateTicketInput,
  UpdateTicketInput,
  UpdateTicketPriorityInput,
  UpdateTicketStatusInput,
} from "@repo/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { toast } from "sonner";
import { ticketApi } from "./api";

export function useTicket() {
  const { orgId, ticketId } = useParams();
  const queryClient = useQueryClient();
  const { data: ticketData, isLoading: isLoadingTicketData } = useQuery({
    queryFn: ticketApi.getAll,
    queryKey: ["ticket", { orgId }],
    enabled: !!orgId,
  });
  const { data: ticketSummary, isLoading: isLoadingTicketSummary } = useQuery({
    queryFn: ticketApi.getSummary,
    queryKey: ["ticket", "summary", { orgId }],
    enabled: !!orgId,
  });
  const { data: assignedTicket, isLoading: isLoadingAssigned } = useQuery({
    queryFn: ticketApi.getAssigned,
    queryKey: ["ticket", "me", { orgId }],
    enabled: !!orgId,
  });
  const { data: ticketDetails, isLoading: isLoadingTicketDetails } = useQuery({
    queryFn: () => ticketApi.getDetails(ticketId!),
    queryKey: ["ticket", { ticketId }],
    enabled: !!ticketId,
  });
  const { mutate: createdTicket, isPending: isCreatingTicket } = useMutation({
    mutationFn: (data: CreateTicketInput) => ticketApi.create(data),
    onSuccess: () => {
      toast.success("ticket created successfully");
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: updateTicket, isPending: isUpdatingTicket } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketInput }) =>
      ticketApi.update(id, data),
    onSuccess: () => {
      toast.success("ticket updated successfully");
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: updateTicketStatus, isPending: isUpdatingTicketStatus } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketStatusInput }) =>
      ticketApi.updateStatus(id, data),
    onSuccess: () => {
      toast.success("ticket updated successfully");
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: updateTicketPriority, isPending: isUpdatingTicketPriority } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketPriorityInput }) =>
      ticketApi.updatePriority(id, data),
    onSuccess: () => {
      toast.success("ticket updated successfully");
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: assignTicket, isPending: isAssigningTicket } = useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: AssignTicketInput }) =>
      ticketApi.assignTicket(ticketId, data),
    onSuccess: () => {
      toast.success("ticket assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: commentTicket, isPending: isAssigningComment } = useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: CreateTicketCommentInput }) =>
      ticketApi.comment(ticketId, data),
    onSuccess: () => {
      toast.success("ticket assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: escalateTicket, isPending: isEscalatingTicket } = useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: EscalateTicketInput }) =>
      ticketApi.escalate(ticketId, data),
    onSuccess: () => {
      toast.success("ticket escalated successfully");
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return {
    ticketData,
    isLoadingTicketData,
    createdTicket,
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
  };
}
