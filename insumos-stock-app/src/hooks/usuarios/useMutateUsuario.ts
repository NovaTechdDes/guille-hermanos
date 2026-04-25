import { postLogin } from "@/src/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutateUsuario = () => {
    const queryClient = useQueryClient();


        const startPostLogin =  useMutation({
        mutationFn: async ({usuario, password}: {usuario: string, password: string}) => {
            return await postLogin(usuario, password)
        },
        onSuccess: (data) => {
            console.log(data)
        }
        ,onError: (data) => {
            console.log(data)
        }
    })


    return {
        startPostLogin
    }
}