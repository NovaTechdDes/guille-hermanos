import { getMovimientosForDate } from "@/src/actions/movimientos.actions";
import { useQuery } from "@tanstack/react-query";

export const useMovimientos = (desde: string, hasta: string) => {
  return useQuery({
    queryKey: ["movimientos", desde, hasta],
    queryFn: () => getMovimientosForDate(desde, hasta),
  });
};
