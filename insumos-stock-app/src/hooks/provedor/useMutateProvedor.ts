import { postProvedor, updateProvedor } from '@/src/actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMutateProvedor = () => {
  const queryClient = useQueryClient();

  const startPostProvedor = useMutation({
    mutationFn: (nombre: string) => postProvedor(nombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });

  const startPutProvedor = useMutation({
    mutationFn: ({ id_provedor, nombre }: { id_provedor: string; nombre: string }) => updateProvedor(id_provedor, nombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });

  return {
    startPostProvedor,
    startPutProvedor,
  };
};
