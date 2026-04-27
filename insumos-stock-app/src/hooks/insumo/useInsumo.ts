import { getInsumos } from "@/src/actions";
import { useQuery } from "@tanstack/react-query";

export const useInsumo = () => {
  return useQuery({
    queryKey: ["insumo"],
    queryFn: () => getInsumos(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
