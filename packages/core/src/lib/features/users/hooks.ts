import type { UpdateMyDetailsInput } from '@org/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from './api.js';

export const useUser = () => {
  const queryClient = useQueryClient();
  const { data: userDetails, isLoading: isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: userApi.myDetails,
  });

  const { mutate: updateMyDetails, isPending: isUpdating } = useMutation({
    mutationFn: (input: UpdateMyDetailsInput) => userApi.updateMyDetails(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return { userDetails, isLoading, updateMyDetails, isUpdating };
};
