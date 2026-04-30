import { supabase } from '../lib/supabase';
import { mensaje } from '../utils/mensaje';

export const postBodega = async (nombre: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('bodega').insert({ nombre }).select('*').single();

    if (error && error.code === '23505') {
      mensaje('error', 'La Bodega ya existe');
      return false;
    } else if (error) {
      mensaje('error', 'Error al crear la Bodega');
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const updateBodega = async (id_bodega: string, nombre: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('bodega').update({ nombre }).eq('id_bodega', id_bodega).select('*').single();

    if (error) return false;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
