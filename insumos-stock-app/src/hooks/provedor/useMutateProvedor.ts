import { postProvedor } from '@/src/actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMutateProvedor = () => {
  const queryClient = useQueryClient();

  const startPostProvedor = useMutation({
    mutationFn: (nombre: string) => postProvedor(nombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });

  return {
    startPostProvedor,
  };
};
