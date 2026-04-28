import { createNewInsumo, updateInsumo } from '@/src/actions';
import { Insumo } from '@/src/interface/Insumo';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMutateInsumo = () => {
  const queryClient = useQueryClient();

  const startPostInsumo = useMutation({
    mutationFn: (data: Partial<Insumo>) => createNewInsumo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      queryClient.invalidateQueries({ queryKey: ['data'] });
      queryClient.invalidateQueries({ queryKey: ['stock'] });
    },
  });

  const startPutInsumo = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Insumo> }) => updateInsumo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      queryClient.invalidateQueries({ queryKey: ['insumo'] });
      queryClient.invalidateQueries({ queryKey: ['data'] });
      queryClient.invalidateQueries({ queryKey: ['stock'] });
    },
  });

  return {
    startPostInsumo,
    startPutInsumo,
  };
};
