import { getAllUsuarios, getUsuario, getUsuarioById } from '@/src/actions';
import { useQuery } from '@tanstack/react-query';

export const useUsuarios = (usuario: string, password: string) => {
  return useQuery({
    queryKey: ['usuarios', usuario, password],
    queryFn: () => getUsuario(usuario, password),
  });
};

export const useUsuario = (id: string) => {
  return useQuery({
    queryKey: ['usuario', id],
    queryFn: () => getUsuarioById(id),
  });
};

export const useAllUsuarios = () => {
  return useQuery({
    queryKey: ['allUsuarios'],
    queryFn: () => getAllUsuarios(),
  });
};
