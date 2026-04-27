import usuarios from "../data/usuarios";
import { Usuario } from "../interface/Usuario";

export const getUsuario = async (
  usuario: string,
  password: string,
): Promise<Usuario | null> => {
  const usuarioEncontrado = usuarios.find(
    (u) => u.usuario === usuario && u.password === password,
  );

  if (!usuarioEncontrado) return null;

  const { password: _password, ...usuarioData } = usuarioEncontrado;
  return usuarioData;
};

export const postLogin = async (usuario: string, password: string) => {
  try {
    const usuarioEncontrado = await getUsuario(usuario, password);

    if (!usuarioEncontrado) {
      return {
        ok: false,
        message: "Usuario o contraseña incorrectos",
      };
    }

    return {
      ok: true,
      message: "Usuario logueado correctamente",
      usuario: usuarioEncontrado,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al loguearse",
    };
  }
};
