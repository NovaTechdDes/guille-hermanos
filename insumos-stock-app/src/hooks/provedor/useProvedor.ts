import { getProvedores } from "@/src/actions";
import { useQuery } from "@tanstack/react-query";

export const useProvedor = () => {
  return useQuery({
    queryKey: ["provedor"],
    queryFn: () => getProvedores(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
