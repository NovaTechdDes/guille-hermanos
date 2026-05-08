import { supabase } from '@/src/lib/supabase';
import usuarios from '../data/usuarios';
import { Usuario } from '../interface/Usuario';

export const getUsuario = async (usuario: string, password: string): Promise<Usuario | null> => {
  const usuarioEncontrado = usuarios.find((u) => u.usuario === usuario && u.password === password);

  if (!usuarioEncontrado) return null;

  const { password: _password, ...usuarioData } = usuarioEncontrado;
  return usuarioData;
};

export const postLogin = async (username: string, password: string) => {
  try {
    const { data: usuario } = await supabase.from('usuarios').select('*').eq('nombre', username.toLowerCase().trim()).single();

    if (!usuario) {
      throw new Error('Usuario no existe');
    }

    const email = `${username.trim()}@app.local`;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw error;
    }

    if (!data.session || !usuario.activo) {
      throw new Error('Usuario no activo');
    }

    return {
      ok: true as const,
      message: 'Usuario logueado correctamente',
      usuario: usuario,
      session: data.session,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false as const,
      message: 'Error al loguearse',
    };
  }
};

export const getUsuarioById = async (id: number): Promise<Usuario | null> => {
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

export const toggleActivo = async (id_usuario: number, activo: boolean): Promise<boolean> => {
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
    const { error } = await supabase.functions.invoke('create-usuario', {
      body: {
        p_username: nombre,
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

export const updateUser = async (id_usuario: number, usuario: string, password: string, rol: string): Promise<boolean> => {
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
