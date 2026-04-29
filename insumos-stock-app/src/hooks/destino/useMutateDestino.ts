import { postDestino } from '@/src/actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMutateDestino = () => {
  const queryClient = useQueryClient();

  const startPostDestino = useMutation({
    mutationFn: (nombre: string) => postDestino(nombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });

  return {
    startPostDestino,
  };
};
