import type { FilterOptions } from '@org/web-utils';
import type { CreateCustomerInput, UpdateCustomerInput } from '@org/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerApi } from './api.js';
interface props {
  filterOptions?: FilterOptions;
  orgId: string | undefined;
}
export const useCustomer = ({ filterOptions, orgId }: props) => {
  const queryClient = useQueryClient();
  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryFn: () => customerApi.getAll(filterOptions),
    queryKey: ['customer', { orgId }, filterOptions],
  });
  const { mutate: createCustomer, isPending: isCreatingCustomer } = useMutation(
    {
      mutationFn: (data: CreateCustomerInput) => customerApi.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['customer', { orgId }] });
      },
    },
  );

  const { mutate: updateCustomer, isPending: isUpdatingCustomer } = useMutation(
    {
      mutationFn: ({ id, data }: { id: string; data: UpdateCustomerInput }) =>
        customerApi.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['customer', { orgId }] });
      },
    },
  );

  return {
    customers,
    isLoadingCustomers,
    createCustomer,
    isCreatingCustomer,
    updateCustomer,
    isUpdatingCustomer,
  };
};
