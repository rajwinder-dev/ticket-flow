import type { CreateQueueGroupInput } from '@org/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import queueGroupApi from './api.js';
interface props {
  orgId: string | undefined;
}
export function useQueueGroup({ orgId }: props) {
  const queryClient = useQueryClient();
  const {
    data: queueGroups,
    isLoading: isLoadingQueueGroups,
    error: queueGroupError,
  } = useQuery({
    queryFn: queueGroupApi.getAll,
    queryKey: ['group', { orgId }],
    retry: false,
  });

  const { mutate: createGroup, isPending: isCreatingGroup } = useMutation({
    mutationFn: (data: CreateQueueGroupInput) => queueGroupApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', { orgId }] });
    },
  });

  const { mutate: updateGroup, isPending: isUpdatingGroup } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateQueueGroupInput }) =>
      queueGroupApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', { orgId }] });
    },
  });

  const { mutate: deleteGroup, isPending: isDeletingGroup } = useMutation({
    mutationFn: (groupId: string) => queueGroupApi.delete(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', { orgId }] });
    },
  });
  const { mutate: changeDefaultGroup, isPending: isChangingDefaultGroup } =
    useMutation({
      mutationFn: (groupId: string) => queueGroupApi.delete(groupId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['group', { orgId }] });
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
    queueGroupError,
  };
}
// TODO: remove later
import { useState } from 'react';
import {
  GROUP_COLORS,
  INITIAL_GROUPS,
  type Group,
  type Queue,
} from './groups.js';

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [selectedId, setSelectedId] = useState<string | null>(
    INITIAL_GROUPS[0].id,
  );

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
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, queues: [...g.queues, newQueue] } : g,
      ),
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
