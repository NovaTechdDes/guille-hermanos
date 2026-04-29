import { supabase } from '../lib/supabase';

export const postBodega = async (nombre: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('bodega').insert({ nombre }).select('*').single();

    if (error) return false;
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
