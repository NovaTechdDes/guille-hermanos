import { supabase } from '../lib/supabase';
import { mensaje } from '../utils/mensaje';

export const postProvedor = async (nombre: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('provedor').insert({ nombre }).select('*').single();

    if (error && error.code === '23505') {
      mensaje('error', 'El provedor ya existe');
      return false;
    } else if (error) {
      mensaje('error', 'Error al crear provedor');
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const updateProvedor = async (id_provedor: string, nombre: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('provedor').update({ nombre }).eq('id_provedor', id_provedor).select('*').single();

    if (error) return false;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
