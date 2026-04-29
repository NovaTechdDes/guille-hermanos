import { supabase } from '../lib/supabase';

export const postProvedor = async (nombre: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('provedor').insert({ nombre }).select('*').single();

    if (error) return false;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const updateProvedor = async (id_provedor: string, nombre: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('provedor').update({ nombre }).eq('id_provedor', id_provedor).select('*').single();
    console.log({ id_provedor, nombre });

    if (error) return false;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
