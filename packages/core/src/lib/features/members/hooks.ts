import type { FilterOptions } from '@org/web-utils';
import type { InviteUserOrganizationInput } from '@org/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { memberApi } from './api.js';
interface props {
  filterOptions?: FilterOptions;
  orgId: string | undefined;
  token?: string;
}
export const useMember = ({ filterOptions, orgId, token }: props) => {
  const queryClient = useQueryClient();
  const {
    data: members,
    isLoading: isLoadingMembers,
    error: membersError,
  } = useQuery({
    queryKey: ['member', { orgId }, { filterOptions }],
    queryFn: () => memberApi.getMembers(filterOptions!),
    enabled: !!orgId,
  });
  const {
    data: inviteDetails,
    isLoading: isLoadingInviteDetails,
    error: InviteError,
  } = useQuery({
    queryKey: ['invite', { token }],
    queryFn: () => memberApi.getInviteDetails(token!),
    enabled: !!token,
    retry: false,
  });
  const { mutate: inviteUserMutate, isPending: isInvitingUser } = useMutation({
    mutationFn: (data: InviteUserOrganizationInput) =>
      memberApi.inviteUser(data),
  });

  const { mutate: acceptInviteMutate, isPending: isAcceptingInvite } =
    useMutation({
      mutationFn: (token: string) => memberApi.acceptInvite(token),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['organizations'] });
      },
    });

  const { mutate: assignQueueMutate, isPending: isAssigningQueue } =
    useMutation({
      mutationFn: ({ queueId, userId }: { queueId: string; userId: string }) =>
        memberApi.assignQueue({ queueId, userId }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['member', { orgId }] });
        queryClient.invalidateQueries({ queryKey: ['queue', { orgId }] });
      },
    });
  const { mutate: unassignQueueMutate, isPending: isUnAssigningQueue } =
    useMutation({
      mutationFn: ({ queueId, userId }: { queueId: string; userId: string }) =>
        memberApi.unassignQueue({ queueId, userId }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['member', { orgId }] });
        queryClient.invalidateQueries({ queryKey: ['queue', { orgId }] });
      },
    });

  const { mutate: updateRoleMutate, isPending: isUpdatingRole } = useMutation({
    mutationFn: ({ roleId, userId }: { roleId: string; userId: string }) =>
      memberApi.updateRole({ roleId, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member', { orgId }] });
      queryClient.invalidateQueries({ queryKey: ['role', { orgId }] });
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
