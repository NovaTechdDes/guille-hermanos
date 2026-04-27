import { getBodegas } from "@/src/actions";
import { useQuery } from "@tanstack/react-query";

export const useBodega = () => {
  return useQuery({
    queryKey: ["bodega"],
    queryFn: () => getBodegas(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
