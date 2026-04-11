import type { CreateQueueGroupInput } from "@repo/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import queueGroupApi from "./api";

export function useQueueGroup() {
  const { orgId } = useParams();
  const queryClient = useQueryClient();
  const { data: queueGroups, isLoading: isLoadingQueueGroups } = useQuery({
    queryFn: queueGroupApi.getAll,
    queryKey: ["group", { orgId }],
    retry: false,
  });

  const { mutate: createGroup, isPending: isCreatingGroup } = useMutation({
    mutationFn: (data: CreateQueueGroupInput) => queueGroupApi.create(data),
    onSuccess: () => {
      toast.success("group created successfully");
      queryClient.invalidateQueries({ queryKey: ["group", { orgId }] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateGroup, isPending: isUpdatingGroup } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateQueueGroupInput }) =>
      queueGroupApi.update(id, data),
    onSuccess: () => {
      toast.success("group updated successfully");
      queryClient.invalidateQueries({ queryKey: ["group", { orgId }] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deleteGroup, isPending: isDeletingGroup } = useMutation({
    mutationFn: (groupId: string) => queueGroupApi.delete(groupId),
    onSuccess: () => {
      toast.success("group deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["group", { orgId }] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: changeDefaultGroup, isPending: isChangingDefaultGroup } = useMutation({
    mutationFn: (groupId: string) => queueGroupApi.delete(groupId),
    onSuccess: () => {
      toast.success("group deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["group", { orgId }] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return {
    queueGroups,
    isLoadingQueueGroups,
    createGroup,
    isCreatingGroup,
    updateGroup,
    isUpdatingGroup,
    deleteGroup,
    isDeletingGroup,
    changeDefaultGroup,
    isChangingDefaultGroup,
  };
}

import { useState } from "react";
import { useParams } from "react-router";
import { GROUP_COLORS, INITIAL_GROUPS, type Group, type Queue } from "./groups";

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [selectedId, setSelectedId] = useState<string | null>(INITIAL_GROUPS[0].id);

  const selectedGroup = groups.find((g) => g.id === selectedId) ?? null;

  function createGroup(name: string, description: string, color: string) {
    const newGroup: Group = {
      id: `g${Date.now()}`,
      name,
      description,
      color,
      memberCount: 0,
      queues: [],
    };
    setGroups((prev) => [...prev, newGroup]);
    setSelectedId(newGroup.id);
  }

  function createQueue(groupId: string, name: string, description: string) {
    const newQueue: Queue = {
      id: `q${Date.now()}`,
      name,
      description,
      ticketCount: 0,
      openCount: 0,
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, queues: [...g.queues, newQueue] } : g)),
    );
  }

  return {
    groups,
    selectedId,
    selectedGroup,
    setSelectedId,
    createGroup,
    createQueue,
    groupColors: GROUP_COLORS,
  };
}
