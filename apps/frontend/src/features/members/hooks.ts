import type { InviteUserOrganizationInput } from "@repo/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { memberApi } from "./api";

const useMember = () => {
  const { orgId, token } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["member", orgId],
    queryFn: memberApi.getMembers,
    enabled: !!orgId,
  });
  const { data: inviteDetails, isLoading: isLoadingInviteDetails, error: InviteError } = useQuery({
    queryKey: ["invite", token],
    queryFn: () => memberApi.getInviteDetails(token!),
    enabled: !!token,
    retry: false
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
  return {
    members,
    isLoadingMembers,
    inviteUserMutate,
    isInvitingUser,
    acceptInviteMutate,
    isAcceptingInvite,
    inviteDetails,
    isLoadingInviteDetails,
    InviteError
  };
};
export default useMember;
