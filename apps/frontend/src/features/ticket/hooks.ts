import type {
  AssignTicketInput,
  CreateTicketCommentInput,
  CreateTicketInput,
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
  const { data: ticket, isLoading: isLoadingTicket } = useQuery({
    queryFn: ticketApi.getAll,
    queryKey: ["ticket"],
    enabled: !!orgId,
  });
  const { data: assignedTicket, isLoading: isLoadingAssigned } = useQuery({
    queryFn: ticketApi.getAssigned,
    queryKey: ["ticket", "me"],
    enabled: !!orgId,
  });
  const { data: ticketDetails, isLoading: isLoadingTicketDetails } = useQuery({
    queryFn: () => ticketApi.getDetails(ticketId!),
    queryKey: ["ticket", ticketId],
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
  const { mutate: updatedTicketStatus, isPending: isUpdatingTicketStatus } = useMutation({
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
  const { mutate: updatedTicketPriority, isPending: isUpdatingTicketPriority } = useMutation({
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
  const { mutate: escalateTicket, isPending: isAssigningEscalate } = useMutation({
    mutationFn: (ticketId: string) => ticketApi.escalate(ticketId),
    onSuccess: () => {
      toast.success("ticket assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return {
    ticket,
    isLoadingTicket,
    createdTicket,
    isCreatingTicket,
    updatedTicketPriority,
    isUpdatingTicketPriority,
    assignTicket,
    isAssigningTicket,
    assignedTicket,
    isLoadingAssigned,
    ticketDetails,
    isLoadingTicketDetails,
    updatedTicketStatus,
    isUpdatingTicketStatus,
    commentTicket,
    isAssigningComment,
    escalateTicket,
    isAssigningEscalate,
  };
}
