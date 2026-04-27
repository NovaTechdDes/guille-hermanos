import { create } from "zustand";

interface StockState {
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  buscador: string;
  setBuscador: (buscador: string) => void;
}

export const useStockStore = create<StockState>((set) => ({
  modalOpen: false,
  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),

  buscador: "",
  setBuscador: (buscador: string) => set({ buscador }),
}));
