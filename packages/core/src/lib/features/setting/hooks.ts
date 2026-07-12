import type {
  CreateEmailProviderInput,
  CreateSmtpInput,
  UpdateEmailProviderInput,
} from '@org/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { emailApi } from './api.js';
interface props {
  orgId: string | undefined;
}
export const useEmail = ({ orgId }: props) => {
  const queryClient = useQueryClient();

  // --- Queries ---
  const { data: emailProviders, isLoading: isLoadingEmailProviders } = useQuery(
    {
      queryFn: emailApi.getProviders,
      queryKey: ['email-provider', { orgId }],
    },
  );

  const { mutate: createEmailProvider, isPending: isCreatingEmailProvider } =
    useMutation({
      mutationFn: (data: CreateEmailProviderInput) =>
        emailApi.createProvider(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['email-provider', { orgId }],
        });
      },
    });
  const { mutate: createSMTP, isPending: isCreatingSMTP } = useMutation({
    mutationFn: (data: CreateSmtpInput) => emailApi.createSMTP(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['email-provider', { orgId }],
      });
    },
  });

  const { mutate: updateCredentials, isPending: isUpdatingCredentials } =
    useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: UpdateEmailProviderInput;
      }) => emailApi.updateCredentials(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['email-provider', { orgId }],
        });
      },
    });

  const { mutate: deleteProvider, isPending: isDeletingProvider } = useMutation(
    {
      mutationFn: (id: string) => emailApi.deleteProvider(id),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['email-provider', { orgId }],
        });
      },
    },
  );

  const { mutate: testProvider, isPending: isTestingProvider } = useMutation({
    mutationFn: emailApi.testProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['email-provider', { orgId }],
      });
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
};
