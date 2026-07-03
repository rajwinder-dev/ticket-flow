import type { CreateOrganizationInput, UpdateOrganizationInput } from "@org/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { orgApi } from "./api.js";

function useOrganizations() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: onboardSatus } = useQuery({

    queryFn: orgApi.onboardStatus,
    enabled: !!orgId,
    queryKey: ["organization","onboarding-status",  { orgId }],
  });
  // --- Queries ---
  const { data: organizations, isLoading: isLoadingOrganizations } = useQuery({
    queryFn: orgApi.getMine,
    queryKey: ["organizations"],
    retry: false,
  });
  const { data: currentOrganization, isLoading: isLoadingCurrent } = useQuery({
    queryFn: orgApi.getCurrent,
    queryKey: ["organization", { orgId }],
    enabled: !!orgId,
    retry: false,
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

  return {
    organizations,
    isLoadingOrganizations,
    createOrg,
    isCreatingOrg,
    updateOrg,
    isUpdatingOrg,
    deleteOrg,
    isDeletingOrg,
    onboardSatus,
    currentOrganization,
    isLoadingCurrent,
  };
}

export default useOrganizations;
