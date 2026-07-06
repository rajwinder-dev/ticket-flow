import type { CreateRoleInput } from '@org/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roleApi } from './api.js';
interface props {
  roleId?: string | undefined;
  orgId: string | undefined;
}
export const useRole = ({ roleId, orgId }: props) => {
  const queryClient = useQueryClient();

  // --- Queries ---
  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryFn: roleApi.getAllRoles,
    queryKey: ['role', { orgId }],
    retry: false,
  });
  const { data: getRoleDetails, isLoading: isLoadingRoleDetails } = useQuery({
    queryFn: () => roleApi.getDetails(roleId!),
    queryKey: ['role', { roleId }],
    enabled: !!roleId,
  });

  // --- Mutations ---
  const { mutate: createRole, isPending: isCreatingRole } = useMutation({
    mutationFn: (data: CreateRoleInput) => roleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role', { orgId }] });
    },
  });

  const { mutate: updateRole, isPending: isUpdatingRole } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateRoleInput }) =>
      roleApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role', { orgId }] });
    },
  });

  const { mutate: deleteRole, isPending: isDeletingRole } = useMutation({
    mutationFn: (roleId: string) => roleApi.delete(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role', { orgId }] });
    },
  });

  return {
    getRoleDetails,
    isLoadingRoleDetails,
    roles,
    isLoadingRoles,
    createRole,
    isCreatingRole,
    updateRole,
    isUpdatingRole,
    deleteRole,
    isDeletingRole,
  };
};
