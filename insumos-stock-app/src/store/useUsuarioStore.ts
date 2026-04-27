import { create } from "zustand";
import { Usuario } from "../interface/Usuario";

interface UsuarioState {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
}

export const useUsuarioStore = create<UsuarioState>((set) => ({
  usuario: null,
  setUsuario: (usuario: Usuario | null) => set({ usuario }),
}));
