import { getInsumoById, getInsumos } from "@/src/actions";
import { useQuery } from "@tanstack/react-query";

export const useInsumo = () => {
  return useQuery({
    queryKey: ["insumo"],
    queryFn: () => getInsumos(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useInsumoById = (id: string) => {
  return useQuery({
    queryKey: ["insumo", id],
    queryFn: () => getInsumoById(id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
