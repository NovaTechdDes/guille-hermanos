import { postBodega } from '@/src/actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMutateBodega = () => {
  const queryClient = useQueryClient();

  const startPostBodega = useMutation({
    mutationFn: (nombre: string) => postBodega(nombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });

  return {
    startPostBodega,
  };
};
