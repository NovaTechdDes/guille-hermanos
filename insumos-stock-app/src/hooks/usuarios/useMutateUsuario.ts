import { createUser, postLogin, toggleActivo } from '@/src/actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMutateUsuario = () => {
  const queryClient = useQueryClient();

  const startPostLogin = useMutation({
    mutationFn: async ({ usuario, password }: { usuario: string; password: string }) => {
      return await postLogin(usuario, password);
    },
  });

  const startUpdateLogin = useMutation({
    mutationFn: async ({ id_usuario, estado }: { id_usuario: string; estado: boolean }) => {
      return await toggleActivo(id_usuario, estado);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['allUsuarios'] });
    },
  });

  const startCreateUser = useMutation({
    mutationFn: async ({ nombre, password, rol }: { nombre: string; password: string; rol: string }) => {
      return await createUser(nombre, password, rol);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['allUsuarios'] });
    },
  });

  return {
    startPostLogin,
    startUpdateLogin,
    startCreateUser,
  };
};
