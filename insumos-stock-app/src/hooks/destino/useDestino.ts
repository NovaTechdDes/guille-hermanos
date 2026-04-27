import { getDestinos } from "@/src/actions";
import { useQuery } from "@tanstack/react-query";

export const useDestino = () => {
  return useQuery({
    queryKey: ["destino"],
    queryFn: () => getDestinos(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
