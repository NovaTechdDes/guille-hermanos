import { postDestino, updateDestino } from '@/src/actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMutateDestino = () => {
  const queryClient = useQueryClient();

  const startPostDestino = useMutation({
    mutationFn: (nombre: string) => postDestino(nombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });

  const startPutDestino = useMutation({
    mutationFn: ({ id_destino, nombre }: { id_destino: string; nombre: string }) => updateDestino(id_destino, nombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });

  return {
    startPostDestino,
    startPutDestino,
  };
};
