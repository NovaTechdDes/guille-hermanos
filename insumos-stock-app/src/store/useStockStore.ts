import { create } from 'zustand';
import { Insumo } from '../interface/Insumo';

interface StockState {
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  buscador: string;
  setBuscador: (buscador: string) => void;

  insumoSeleccionado: Insumo | null;
  setInsumoSeleccionado: (insumo: Insumo | null) => void;
}

export const useStockStore = create<StockState>((set) => ({
  modalOpen: false,
  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),

  buscador: '',
  setBuscador: (buscador: string) => set({ buscador }),

  insumoSeleccionado: null,
  setInsumoSeleccionado: (insumo: Insumo | null) => set({ insumoSeleccionado: insumo }),
}));
