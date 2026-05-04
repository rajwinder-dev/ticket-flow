import { create } from "zustand";

interface MembersState {
  selected: Set<string>;
  inviteToken: string | null;
  tokenEmail: string | null;
  setInviteToken: ({ token, email }: { token: string; email: string }) => void;
  toggle: (id: string) => void;
  clear: () => void;
  clearInvite: () => void;
  selectAllVisible: (ids: { id: string }[]) => void;
}

export const useMembersStore = create<MembersState>((set) => ({
  selected: new Set(),
  inviteToken: null,
  tokenEmail: null,
  setInviteToken: ({ token, email }) => set({ inviteToken: token, tokenEmail: email }),
  clearInvite: () => set({ inviteToken: null, tokenEmail: null }),
  toggle: (id) =>
    set((state) => {
      const next = new Set(state.selected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selected: next };
    }),
  clear: () => set({ selected: new Set() }),
  selectAllVisible: (rows: { id: string }[]) =>
    set((state) => {
      const next = new Set(state.selected);

      rows.forEach((row) => {
        next.add(row.id);
      });

      return { selected: next };
    }),
}));
