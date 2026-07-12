import { create } from "zustand";
interface QueueGroupStore {
  selectedId: string | null;
  setGroupId: (id: string) => void;
  reset: () => void;
}
export const useQueueGroupStore = create<QueueGroupStore>((set) => ({
  selectedId: null,
  setGroupId: (id) => set({ selectedId: id }),
  reset: () => set({ selectedId: null }),
}));
