import type { FilterOptions } from "@org/utils";
import type { CreateCustomerInput, UpdateCustomerInput } from "@org/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { toast } from "sonner";
import { customerApi } from "./api.js";
interface props {
  filterOptions?: FilterOptions;
}
function useCustomer({ filterOptions }: props = {}) {
  const { orgId } = useParams();
  const queryClient = useQueryClient();
  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryFn: () => customerApi.getAll(filterOptions),
    queryKey: ["customer", { orgId }, filterOptions],
  });
  // --- Mutations ---
  const { mutate: createCustomer, isPending: isCreatingCustomer } = useMutation({
    mutationFn: (data: CreateCustomerInput) => customerApi.create(data),
    onSuccess: () => {
      toast.success("customer created successfully");
      queryClient.invalidateQueries({ queryKey: ["customer", { orgId }] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateCustomer, isPending: isUpdatingCustomer } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerInput }) =>
      customerApi.update(id, data),
    onSuccess: () => {
      toast.success("customer updated successfully");
      queryClient.invalidateQueries({ queryKey: ["customer", { orgId }] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    customers,
    isLoadingCustomers,
    createCustomer,
    isCreatingCustomer,
    updateCustomer,
    isUpdatingCustomer,
  };
}

export default useCustomer;
