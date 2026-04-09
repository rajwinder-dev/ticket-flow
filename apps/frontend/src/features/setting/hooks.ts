import type {
  CreateEmailProviderInput,
  CreateSmtpInput,
  UpdateEmailProviderInput,
} from "@repo/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { emailApi } from "./api";

function useEmail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- Queries ---
  const { data: emailProviders, isLoading: isLoadingEmailProviders } = useQuery({
    queryFn: emailApi.getProviders,
    queryKey: ["email-provider"],
  });

  const { mutate: createEmailProvider, isPending: isCreatingEmailProvider } = useMutation({
    mutationFn: (data: CreateEmailProviderInput) => emailApi.createProvider(data),
    onSuccess: () => {
      toast.success("Provider created successfully");
      queryClient.invalidateQueries({ queryKey: ["email-provider"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: createSMTP, isPending: isCreatingSMTP } = useMutation({
    mutationFn: (data: CreateSmtpInput) => emailApi.createSMTP(data),
    onSuccess: () => {
      toast.success("Provider created successfully");
      queryClient.invalidateQueries({ queryKey: ["email-provider"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateCredentials, isPending: isUpdatingCredentials } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmailProviderInput }) =>
      emailApi.updateCredentials(id, data),
    onSuccess: () => {
      toast.success("Organization updated successfully");
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteProvider, isPending: isDeletingProvider } = useMutation({
    mutationFn: (id: string) => emailApi.deleteProvider(id),
    onSuccess: () => {
      toast.success("Provider deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: testProvider, isPending: isTestingProvider } = useMutation({
    mutationFn: emailApi.testProvider,
    onSuccess: () => {
      toast.success("email send successfully");
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      navigate("/org");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    emailProviders,
    isLoadingEmailProviders,
    createEmailProvider,
    isCreatingEmailProvider,
    createSMTP,
    isCreatingSMTP,
    updateCredentials,
    isUpdatingCredentials,
    deleteProvider,
    isDeletingProvider,
    testProvider,
    isTestingProvider,
  };
}

export default useEmail;
