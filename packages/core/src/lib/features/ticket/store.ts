import { TicketDetailsSchema, TicketSchemaResponse } from '@org/zod';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
type TicketSchema = TicketDetailsSchema | TicketSchemaResponse;
type TicketType = {
  editTicketForm: boolean;
  setEditTicketForm: (value: boolean) => void;
  selectedTicket: TicketSchema | null;
  setSelectedTicket: (value: TicketSchema) => void;
  escalateTicketForm: boolean;
  setEscalateTicketForm: (value: boolean) => void;
  handleOpenTicketForm: (ticket: TicketSchema) => void;
  handleCloseTicketForm: () => void;
  handleOpenEscalateForm: (ticket: TicketSchema) => void;
  handlcloseEscalateForm: () => void;
};
export const useTicketStore = create<TicketType>()(
  devtools((set) => ({
    editTicketForm: false,
    setEditTicketForm: (value) => set({ editTicketForm: value }),
    selectedTicket: null,
    setSelectedTicket: (value) => set({ selectedTicket: value }),
    escalateTicketForm: false,
    setEscalateTicketForm: (value) => set({ escalateTicketForm: value }),
    handleOpenTicketForm: (ticket) =>
      set({ editTicketForm: true, selectedTicket: ticket }),
    handleCloseTicketForm: () =>
      set({ editTicketForm: false, selectedTicket: null }),
    handleOpenEscalateForm: (ticket) =>
      set({
        escalateTicketForm: true,
        selectedTicket: ticket,
        editTicketForm: false,
      }),
    handlcloseEscalateForm: () =>
      set({ escalateTicketForm: false, selectedTicket: null }),
  })),
);
