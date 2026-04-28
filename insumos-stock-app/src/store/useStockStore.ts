import { create } from "zustand";
import { Insumo } from "../interface/Insumo";

interface StockState {
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  buscador: string;
  setBuscador: (buscador: string) => void;

  insumoSeleccionado: Insumo | null;
  setInsumoSeleccionado: (insumo: Insumo) => void;
}

export const useStockStore = create<StockState>((set) => ({
  modalOpen: false,
  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),

  buscador: "",
  setBuscador: (buscador: string) => set({ buscador }),

  insumoSeleccionado: null,
  setInsumoSeleccionado: (insumo: Insumo) =>
    set({ insumoSeleccionado: insumo }),
}));
