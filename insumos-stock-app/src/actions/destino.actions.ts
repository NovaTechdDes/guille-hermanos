import { supabase } from '../lib/supabase';
import { mensaje } from '../utils/mensaje';

export const postDestino = async (nombre: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('destino').insert({ nombre }).select('*').single();

    if (error && error.code === '23505') {
      mensaje('error', 'El destino ya existe');
      return false;
    } else if (error) {
      mensaje('error', 'Error al crear destino');
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const updateDestino = async (id_destino: string, nombre: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('destino').update({ nombre }).eq('id_destino', id_destino).select('*').single();

    if (error) return false;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
