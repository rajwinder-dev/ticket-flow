import { useState, useCallback } from "react";
import type { QueueSchemaResponse } from "@org/zod";

export type QueueFormValues = {
  name: string;
  description: string;
};

export function useQueueActions(initialQueues: QueueSchemaResponse[] = []) {
  const [queues, setQueues] = useState<QueueSchemaResponse[]>(initialQueues);
  const [editingQueue, setEditingQueue] = useState<QueueSchemaResponse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const moveUp = useCallback((id: string) => {
    setQueues((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next.map((q, i) => ({ ...q, order: i + 1 }));
    });
  }, []);

  const moveDown = useCallback((id: string) => {
    setQueues((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      if (idx === -1 || idx === prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next.map((q, i) => ({ ...q, order: i + 1 }));
    });
  }, []);

  const deleteQueue = useCallback((id: string) => {
    setQueues((prev) =>
      prev
        .filter((q) => q.id !== id)
        .map((q, i) => ({ ...q, order: i + 1 }))
    );
  }, []);

  const openEditModal = useCallback((queue: QueueSchemaResponse) => {
    setEditingQueue(queue);
    setIsEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingQueue(null);
  }, []);

  const submitEdit = useCallback(
    (values: QueueFormValues) => {
      if (!editingQueue) return;
      setQueues((prev) =>
        prev.map((q) =>
          q.id === editingQueue.id ? { ...q, ...values } : q
        )
      );
      closeEditModal();
    },
    [editingQueue, closeEditModal]
  );

  return {
    queues,
    editingQueue,
    isEditModalOpen,
    moveUp,
    moveDown,
    deleteQueue,
    openEditModal,
    closeEditModal,
    submitEdit,
  };
}
