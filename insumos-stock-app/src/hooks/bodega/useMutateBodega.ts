import { postBodega, updateBodega } from '@/src/actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMutateBodega = () => {
  const queryClient = useQueryClient();

  const startPostBodega = useMutation({
    mutationFn: (nombre: string) => postBodega(nombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });

  const startPutBodega = useMutation({
    mutationFn: ({ id_bodega, nombre }: { id_bodega: string; nombre: string }) => updateBodega(id_bodega, nombre),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });

  return {
    startPostBodega,
    startPutBodega,
  };
};
