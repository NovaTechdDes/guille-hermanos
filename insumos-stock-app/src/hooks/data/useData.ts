import { getData, getStock } from '@/src/actions/data.actions';
import { useQuery } from '@tanstack/react-query';

export const useData = (id_usuario?: string) => {
  return useQuery({
    queryKey: ['data', id_usuario],
    queryFn: () => getData(id_usuario),
    staleTime: 1000 * 60 * 5,
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
