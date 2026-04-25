
import { getUsuario } from "@/src/actions"
import { useQuery } from "@tanstack/react-query"

export const useUsuarios = (usuario: string, password: string) => {
    return useQuery({
        queryKey: ['usuarios', usuario, password],
        queryFn: () => getUsuario(usuario, password)
    })
}