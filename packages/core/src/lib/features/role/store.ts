import { create } from "zustand";
type RoleStore = {
  roleId: string | null;
  reset: () => void;
  setRoleId: (id: string) => void;
};
export const useRoleStore = create<RoleStore>((set) => ({
  roleId: null,
  setRoleId: (roleId: string) => set({ roleId }),
  reset: () => set({ roleId: null }),
}));
