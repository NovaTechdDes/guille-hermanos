import { addMovimiento } from '@/src/actions/movimientos.actions';
import { Mov_insumo } from '@/src/interface/Mov_insumo';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMutateMovimiento = () => {
  const queryClient = useQueryClient();

  const startPostMovimiento = useMutation({
    mutationFn: async (movimiento: Mov_insumo) => {
      return await addMovimiento(movimiento);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['stock'], refetchType: 'all' });
    },
  });

  return {
    startPostMovimiento,
  };
};
