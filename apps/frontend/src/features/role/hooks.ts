import type { CreateRoleInput, RoleSchema } from "@repo/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import { roleApi } from "./api";

function useRole() {
  const { roleId, orgId } = useParams();
  const queryClient = useQueryClient();

  // --- Queries ---
  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryFn: roleApi.getAllRoles,
    queryKey: ["role", { orgId }],
    retry: false,
  });
  const { data: getRoleDetails, isLoading: isLoadingRoleDetails } = useQuery({
    queryFn: () => roleApi.getDetails(roleId!),
    queryKey: ["role", { roleId }],
    enabled: !!roleId,
  });

  // --- Mutations ---
  const { mutate: createRole, isPending: isCreatingRole } = useMutation({
    mutationFn: (data: CreateRoleInput) => roleApi.create(data),
    onSuccess: () => {
      toast.success("role created successfully");
      queryClient.invalidateQueries({ queryKey: ["role", { orgId }] });
    },
    onError: (error) => {
      console.dir(error)
      toast.error(error.message);
    },
  });

  const { mutate: updateRole, isPending: isUpdatingRole } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateRoleInput }) => roleApi.update(id, data),
    onSuccess: () => {
      toast.success("role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["role", { orgId }] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteRole, isPending: isDeletingRole } = useMutation({
    mutationFn: (roleId: string) => roleApi.delete(roleId),
    onSuccess: () => {
      toast.success("role deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["role", { orgId }] });
    },
    onError: (error) => {
      toast.error(error.message);
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
}

interface UseRolesProps {
  initialRoles?: RoleSchema[];
}
//  todo: remove later
export function useRoles({ initialRoles = [] }: UseRolesProps = {}) {
  const [selectedId, setSelectedId] = useState<string | null>(initialRoles[0]?.id ?? null);
  const [search, setSearch] = useState("");

  return {
    selectedId,
    search,
    setSearch,
    setSelectedId,
  };
}
export default useRole;
