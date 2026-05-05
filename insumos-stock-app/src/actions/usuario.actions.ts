import { supabase } from '@/src/lib/supabase';
import usuarios from '../data/usuarios';
import { Usuario } from '../interface/Usuario';

export const getUsuario = async (usuario: string, password: string): Promise<Usuario | null> => {
  const usuarioEncontrado = usuarios.find((u) => u.usuario === usuario && u.password === password);

  if (!usuarioEncontrado) return null;

  const { password: _password, ...usuarioData } = usuarioEncontrado;
  return usuarioData;
};

export const postLogin = async (usuario: string, password: string) => {
  try {
    const { data: usuarioEncontrado } = await supabase.functions.invoke('rapid-service', {
      body: {
        p_username: usuario,
        p_password: password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (usuarioEncontrado.Error) {
      return {
        ok: false,
        message: 'Usuario o contraseña incorrectos',
      };
    }

    const user = JSON.parse(usuarioEncontrado);

    if (user.session.access_token) {
      await supabase.auth.setSession({
        access_token: user.session.access_token,
        refresh_token: user.session.refresh_token,
      });
    }

    return {
      ok: true,
      message: 'Usuario logueado correctamente',
      usuario: user.usuario,
      session: user.session,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: 'Error al loguearse',
    };
  }
};

export const getUsuarioById = async (id: string): Promise<Usuario | null> => {
  const usuarioEncontrado = usuarios.find((u) => u.id_usuario === id);

  if (!usuarioEncontrado) return null;

  const { password: _password, ...usuarioData } = usuarioEncontrado;
  return usuarioData;
};

export const getAllUsuarios = async (): Promise<Usuario[]> => {
  try {
    const { data, error } = await supabase.from('usuarios').select('id_usuario, usuario: nombre, rol, activo');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const toggleActivo = async (id_usuario: string, activo: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase.from('usuarios').update({ activo }).eq('id_usuario', id_usuario).select();

    if (error) throw error;

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const createUser = async (nombre: string, password: string, rol: string): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('crear_usuario', {
      p_username: nombre,
      p_password: password,
      p_rol: rol,
    });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const updateUser = async (id_usuario: string, usuario: string, password: string, rol: string): Promise<boolean> => {
  try {
    const { error } = await supabase.functions.invoke('actualizar-usuario', {
      body: {
        p_id_usuario: id_usuario,
        p_username: usuario,
        p_password: password,
        p_rol: rol,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
