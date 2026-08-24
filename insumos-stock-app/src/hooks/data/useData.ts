import { getData, getStock } from '@/src/actions/data.actions';
import { useQuery } from '@tanstack/react-query';

export const useData = (id_usuario?: number) => {
  return useQuery({
    queryKey: ['data', id_usuario],
    queryFn: () => getData(id_usuario),
    enabled: typeof id_usuario === 'number' && id_usuario > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24 * 7,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};

export const useStock = () => {
  return useQuery({
    queryKey: ['stock'],
    queryFn: () => getStock(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
