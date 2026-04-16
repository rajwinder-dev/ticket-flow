import type { FilterOptions } from "@/types/axis.types";
import type { InviteUserOrganizationInput } from "@repo/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { memberApi } from "./api";
interface props {
  filterOptions?: FilterOptions;
}
const useMember = ({ filterOptions }: props = {}) => {
  const { orgId, token } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: members,
    isLoading: isLoadingMembers,
    error: membersError,
  } = useQuery({
    queryKey: ["member", { orgId }, { filterOptions }],
    queryFn: () => memberApi.getMembers(filterOptions!),
    enabled: !!orgId,
  });
  const {
    data: inviteDetails,
    isLoading: isLoadingInviteDetails,
    error: InviteError,
  } = useQuery({
    queryKey: ["invite", { token }],
    queryFn: () => memberApi.getInviteDetails(token!),
    enabled: !!token,
    retry: false,
  });
  const { mutate: inviteUserMutate, isPending: isInvitingUser } = useMutation({
    mutationFn: (data: InviteUserOrganizationInput) => memberApi.inviteUser(data),
    onSuccess: () => {
      toast.success("Invitation sent successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: acceptInviteMutate, isPending: isAcceptingInvite } = useMutation({
    mutationFn: (token: string) => memberApi.acceptInvite(token),
    onSuccess: () => {
      toast.success("Joined organization successfully");
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      navigate("/org");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: assignQueueMutate, isPending: isAssigningQueue } = useMutation({
    mutationFn: ({ queueId, userId }: { queueId: string; userId: string }) =>
      memberApi.assignQueue({ queueId, userId }),
    onSuccess: () => {
      toast.success("Queue assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["member", { orgId }] });
      queryClient.invalidateQueries({ queryKey: ["queue", { orgId }] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: unassignQueueMutate, isPending: isUnAssigningQueue } = useMutation({
    mutationFn: ({ queueId, userId }: { queueId: string; userId: string }) =>
      memberApi.unassignQueue({ queueId, userId }),
    onSuccess: () => {
      toast.success("Queue unassigned successfully");
      queryClient.invalidateQueries({ queryKey: ["member", { orgId }] });
      queryClient.invalidateQueries({ queryKey: ["queue", { orgId }] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateRoleMutate, isPending: isUpdatingRole } = useMutation({
    mutationFn: ({ roleId, userId }: { roleId: string; userId: string }) =>
      memberApi.updateRole({ roleId, userId }),
    onSuccess: () => {
      toast.success("Role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["member", { orgId }] });
      queryClient.invalidateQueries({ queryKey: ["role", { orgId }] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return {
    members,
    isLoadingMembers,
    inviteUserMutate,
    isInvitingUser,
    acceptInviteMutate,
    isAcceptingInvite,
    assignQueueMutate,
    isAssigningQueue,
    updateRoleMutate,
    isUpdatingRole,
    inviteDetails,
    isLoadingInviteDetails,
    InviteError,
    unassignQueueMutate,
    isUnAssigningQueue,
    membersError,
  };
};
export default useMember;
