import { create } from 'zustand';
import { Session, Usuario } from '../interface/Usuario';

interface UsuarioState {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;

  session: Session | null;
  setSession: (session: Session | null) => void;
}

export const useUsuarioStore = create<UsuarioState>((set) => ({
  usuario: null,
  setUsuario: (usuario: Usuario | null) => set({ usuario }),

  session: null,
  setSession: (session: Session | null) => set({ session }),
}));
