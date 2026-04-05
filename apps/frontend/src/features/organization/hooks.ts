import type {
  CreateOrganizationInput,
  InviteUserOrganizationInput,
  UpdateOrganizationInput,
} from "@repo/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { orgApi } from "./api";

function useOrganizations() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- Queries ---
  const { data: organizations, isLoading: isLoadingOrganizations } = useQuery({
    queryFn: orgApi.getMine,
    queryKey: ["organizations"],
    retry: false,
  });
  const { data: currentOrganization, isLoading: isLoadingCurrent } = useQuery({
    queryFn: orgApi.getCurrent,
    queryKey: ["organization"],
    enabled: !!orgId,
  });

  // --- Mutations ---
  const { mutate: createOrg, isPending: isCreatingOrg } = useMutation({
    mutationFn: (data: CreateOrganizationInput) => orgApi.create(data),
    onSuccess: (data) => {
      toast.success("Organization created successfully");
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      navigate(`/org/${data.data.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateOrg, isPending: isUpdatingOrg } = useMutation({
    mutationFn: (data: UpdateOrganizationInput) => orgApi.update(data),
    onSuccess: () => {
      toast.success("Organization updated successfully");
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteOrg, isPending: isDeletingOrg } = useMutation({
    mutationFn: (organizationId: string) => orgApi.delete(organizationId),
    onSuccess: () => {
      toast.success("Organization deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: inviteUserMutate, isPending: isInvitingUser } = useMutation({
    mutationFn: (data: InviteUserOrganizationInput) => orgApi.inviteUser(data),
    onSuccess: () => {
      toast.success("Invitation sent successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: acceptInviteMutate, isPending: isAcceptingInvite } = useMutation({
    mutationFn: (token: string) => orgApi.acceptInvite(token),
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
    organizations,
    isLoadingOrganizations,
    createOrg,
    isCreatingOrg,
    updateOrg,
    isUpdatingOrg,
    deleteOrg,
    isDeletingOrg,
    inviteUserMutate,
    isInvitingUser,
    acceptInviteMutate,
    isAcceptingInvite,
    currentOrganization,
    isLoadingCurrent,
  };
}

export default useOrganizations;
